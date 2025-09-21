import { Session } from "@repo/db/schema";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getSessionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found", code: 404 });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", code: 500 });
  }
};

export const getUserSessions = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { limit = "10", cursor } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const pageSize = Math.max(parseInt(limit as string, 10), 1);

    const filter: Record<string, any> = {
      userId: new mongoose.Types.ObjectId(userId),
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
    const results = await Session.aggregate(pipeline);

    const hasNextPage = results.length > pageSize;
    const sessions = hasNextPage ? results.slice(0, pageSize) : results;
    const nextCursor = hasNextPage ? sessions[sessions.length - 1]._id : null;
    return res.json({ sessions, nextCursor, hasNextPage });
  } catch (error) {
    console.error("❌ Error in getUserSessions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
