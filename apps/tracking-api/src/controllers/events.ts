import { Event, Session, User } from "@repo/db/schema";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found", code: 404 });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", code: 500 });
  }
};

export const geSessionEvents = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { limit = "10", cursor } = req.query;

  try {
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(sessionId as string)) {
      return res.status(400).json({ message: "Invalid Session ID" });
    }

    const pageSize = Math.max(parseInt(limit as string, 10), 1);

    const filter: Record<string, any> = {
      sessionId: new mongoose.Types.ObjectId(sessionId ),
    };

    // Add cursor condition (_id > last seen)
    if (cursor) {
      if (!mongoose.Types.ObjectId.isValid(cursor as string)) {
        return res.status(400).json({ message: "Invalid cursor ID" });
      }
      filter._id = { $gt: new mongoose.Types.ObjectId(cursor as string) };
    }

    const pipeline: mongoose.PipelineStage[] = [
      { $match: filter },
      { $sort: { _id: 1 } },
      { $limit: pageSize + 1 }, // fetch one extra to check next page
    ];
    const results = await Event.aggregate(pipeline);

    const hasNextPage = results.length > pageSize;
    const events = hasNextPage ? results.slice(0, pageSize) : results;
    const nextCursor = hasNextPage ? events[events.length - 1]._id : null;
    res.json({ events, nextCursor, hasNextPage });
  } catch (error) {
    console.error("❌ Error in geSessionEvents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
