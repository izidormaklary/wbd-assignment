import { Request, Response } from "express";
import { Session, Event, User } from "@repo/db/schema";
import mongoose from "mongoose";

// Define the allowed event types
const EVENT_TYPES = [
  "search",
  "page_view",
  "add_to_cart",
  "upsell",
  "checkout",
];

// Helper function to normalize event stats
const normalizeEventStats = (eventAgg: any[]): Record<string, any> => {
  const eventStats: Record<string, any> = {};
  for (const type of EVENT_TYPES) {
    const stat = eventAgg.find((e) => e._id === type);
    eventStats[type] = {
      count: stat ? stat.count : 0,
      avgTimeSpent: stat && stat.avgTimeSpent ? stat.avgTimeSpent : 0,
    };
  }
  return eventStats;
};

// Helper function to get page view analytics
const getPageViewAnalytics = async (
  userId?: mongoose.Types.ObjectId,
  before?: Date,
  after?: Date
) => {
  const baseMatchStage = userId
    ? [
        { $match: { type: "page_view" } },
        {
          $lookup: {
            from: "sessions",
            localField: "sessionId",
            foreignField: "_id",
            as: "session",
          },
        },
        { $unwind: "$session" },
        { $match: { "session.userId": userId } },
      ]
    : [{ $match: { type: "page_view" } }];

  // Add date range filters if provided
  const dateFilters: any = {};
  if (before) dateFilters.timestamp = { ...dateFilters.timestamp, $lt: before };
  if (after) dateFilters.timestamp = { ...dateFilters.timestamp, $gte: after };

  const matchStage =
    Object.keys(dateFilters).length > 0
      ? [...baseMatchStage, { $match: dateFilters }]
      : baseMatchStage;

  const pageAgg = await Event.aggregate([
    ...matchStage,
    {
      $group: {
        _id: "$page",
        count: { $sum: 1 },
        avgTimeSpent: { $avg: "$metadata.timeSpent" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return pageAgg;
};

// Helper function to get session aggregation pipeline
const getSessionAggregation = (
  userId?: mongoose.Types.ObjectId,
  before?: Date,
  after?: Date
): mongoose.PipelineStage[] => {
  const baseMatchStage = userId ? { $match: { userId } } : { $match: {} };

  // Add date range filters if provided
  const dateFilters: any = {};
  if (before) dateFilters.startTime = { ...dateFilters.startTime, $lt: before };
  if (after) dateFilters.startTime = { ...dateFilters.startTime, $gte: after };

  const matchStage =
    Object.keys(dateFilters).length > 0
      ? { $match: { ...baseMatchStage.$match, ...dateFilters } }
      : baseMatchStage;

  const groupStage = userId
    ? {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          avgSessionDuration: {
            $avg: { $subtract: ["$endTime", "$startTime"] },
          },
        },
      }
    : {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          avgSessionDuration: {
            $avg: { $subtract: ["$endTime", "$startTime"] },
          },
          uniqueUsers: { $addToSet: "$userId" },
        },
      };

  const pipeline: mongoose.PipelineStage[] = [matchStage, groupStage];

  // Add projection for global analytics
  if (!userId) {
    pipeline.push({
      $project: {
        totalSessions: 1,
        avgSessionDuration: 1,
        totalUsers: { $size: "$uniqueUsers" },
      },
    } as mongoose.PipelineStage);
  }

  return pipeline;
};

export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { before, after } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Parse date filters
    const beforeDate = before ? new Date(before as string) : undefined;
    const afterDate = after ? new Date(after as string) : undefined;

    // Validate dates
    if (beforeDate && isNaN(beforeDate.getTime())) {
      return res.status(400).json({ message: "Invalid 'before' date format" });
    }
    if (afterDate && isNaN(afterDate.getTime())) {
      return res.status(400).json({ message: "Invalid 'after' date format" });
    }

    // Validate date range logic
    if (beforeDate && afterDate && afterDate >= beforeDate) {
      return res.status(400).json({
        message:
          "Invalid date range: 'after' date must be before 'before' date",
      });
    }

    // Find user by _id
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    }).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sessions for this user
    const sessionAgg = await Session.aggregate(
      getSessionAggregation(
        user._id as mongoose.Types.ObjectId,
        beforeDate,
        afterDate
      )
    );
    const sessionStats = sessionAgg[0] || {
      totalSessions: 0,
      avgSessionDuration: 0,
    };

    // Events for sessions belonging to this user
    const eventMatchStage = [
      {
        $lookup: {
          from: "sessions",
          localField: "sessionId",
          foreignField: "_id",
          as: "session",
        },
      },
      { $unwind: "$session" },
      { $match: { "session.userId": user._id } },
    ];

    // Add date range filters for events
    const eventDateFilters: any = {};
    if (beforeDate)
      eventDateFilters.timestamp = {
        ...eventDateFilters.timestamp,
        $lt: beforeDate,
      };
    if (afterDate)
      eventDateFilters.timestamp = {
        ...eventDateFilters.timestamp,
        $gte: afterDate,
      };

    // Combine all match conditions into a single stage
    const finalEventMatchStage = [...eventMatchStage];
    if (Object.keys(eventDateFilters).length > 0) {
      finalEventMatchStage.push({ $match: eventDateFilters });
    }

    const eventAgg = await Event.aggregate([
      ...finalEventMatchStage,
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgTimeSpent: { $avg: "$metadata.timeSpent" },
        },
      },
    ]);

    const eventStats = normalizeEventStats(eventAgg);

    // Get page view analytics
    const pageViewStats = await getPageViewAnalytics(
      user._id as mongoose.Types.ObjectId,
      beforeDate,
      afterDate
    );

    res.json({
      userId: user._id,
      totalSessions: sessionStats.totalSessions,
      avgSessionDuration: sessionStats.avgSessionDuration,
      events: eventStats,
      pageViews: pageViewStats,
      dateRange: {
        before: beforeDate,
        after: afterDate,
      },
    });
  } catch (error) {
    console.error("❌ Error in getUserAnalytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGlobalAnalytics = async (req: Request, res: Response) => {
  try {
    const { before, after } = req.query;

    // Parse date filters
    const beforeDate = before ? new Date(before as string) : undefined;
    const afterDate = after ? new Date(after as string) : undefined;

    // Validate dates
    if (beforeDate && isNaN(beforeDate.getTime())) {
      return res.status(400).json({ message: "Invalid 'before' date format" });
    }
    if (afterDate && isNaN(afterDate.getTime())) {
      return res.status(400).json({ message: "Invalid 'after' date format" });
    }

    // Validate date range logic
    if (beforeDate && afterDate && afterDate >= beforeDate) {
      return res.status(400).json({
        message:
          "Invalid date range: 'after' date must be before 'before' date",
      });
    }

    const sessionAgg = await Session.aggregate(
      getSessionAggregation(undefined, beforeDate, afterDate)
    );
    const sessionStats = sessionAgg[0] || {
      totalSessions: 0,
      avgSessionDuration: 0,
      totalUsers: 0,
    };

    // Events stats with date filtering
    // Add date range filters for events
    const eventDateFilters: any = {};
    if (beforeDate)
      eventDateFilters.timestamp = {
        ...eventDateFilters.timestamp,
        $lt: beforeDate,
      };
    if (afterDate)
      eventDateFilters.timestamp = {
        ...eventDateFilters.timestamp,
        $gte: afterDate,
      };

    const eventAgg = await Event.aggregate([
      ...(Object.keys(eventDateFilters).length > 0
        ? [{ $match: eventDateFilters }]
        : []),
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgTimeSpent: { $avg: "$metadata.timeSpent" },
        },
      },
    ]);

    const eventStats = normalizeEventStats(eventAgg);

    // Get page view analytics
    const pageViewStats = await getPageViewAnalytics(
      undefined,
      beforeDate,
      afterDate
    );

    res.json({
      totalUsers: sessionStats.totalUsers,
      totalSessions: sessionStats.totalSessions,
      avgSessionDuration: sessionStats.avgSessionDuration,
      events: eventStats,
      pageViews: pageViewStats,
      dateRange: {
        before: beforeDate,
        after: afterDate,
      },
    });
  } catch (error) {
    console.error("❌ Error in getGlobalAnalytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
