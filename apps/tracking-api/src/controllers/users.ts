import { User } from "@repo/db/schema";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found", code: 404 });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", code: 500 });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    // aggregate is not used for now
    const { search = "", limit = "10", cursor } = req.query;

    const pageSize = Math.max(parseInt(limit as string, 10), 1);

    // Base filter for search
    const filter: any = search
      ? {
          $or: [
            { name: { $regex: search as string, $options: "i" } },
            { email: { $regex: search as string, $options: "i" } },
          ],
        }
      : {};

    // Add cursor condition (_id > last seen)
    if (cursor) {
      if (!mongoose.Types.ObjectId.isValid(cursor as string)) {
        return res.status(400).json({ message: "Invalid cursor ID" });
      }
      filter._id = { $gt: new mongoose.Types.ObjectId(cursor as string) };
    }

    // Build pipeline
    const pipeline: mongoose.PipelineStage[] = [
      { $match: filter },
      { $sort: { _id: 1 } },
      { $limit: pageSize + 1 }, // fetch one extra to check next page
    ];

    // // Add session aggregation
    // if (aggregate === "sessions" || aggregate === "sessions&events") {
    //   pipeline.push(
    //     {
    //       $lookup: {
    //         from: "sessions",
    //         localField: "_id",
    //         foreignField: "userId",
    //         as: "sessions"
    //       }
    //     },
    //     {
    //       $addFields: {
    //         sessionCount: { $size: "$sessions" },
    //         sessionIds: { $map: { input: "$sessions", as: "s", in: "$$s._id" } }
    //       }
    //     },
    //     { $project: { sessions: 0 } } // drop raw sessions array
    //   );
    // }

    // // Add event stats if requested
    // if (aggregate === "sessions&events") {
    //   pipeline.push({
    //     $lookup: {
    //       from: "events",
    //       let: { sids: "$sessionIds" },
    //       pipeline: [
    //         { $match: { $expr: { $in: ["$sessionId", "$$sids"] } } },
    //         { $group: { _id: "$type", count: { $sum: 1 } } }
    //       ],
    //       as: "eventStats"
    //     }
    //   });
    // }

    // Run aggregation
    const results = await User.aggregate(pipeline);

    // Pagination logic
    const hasNextPage = results.length > pageSize;
    const users = hasNextPage ? results.slice(0, pageSize) : results;
    const nextCursor = hasNextPage ? users[users.length - 1]._id : null;

    res.json({ users, nextCursor, hasNextPage });
  } catch (error) {
    console.error("❌ Error in searchUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
