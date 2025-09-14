import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email?: string;
  country?: string;
  language?: string;
  createdAt: Date;
  distinctId: string;
}

const UserSchema = new Schema<IUser>({
  distinctId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, unique: true },
  country: { type: String },
  language: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Essential indexes for User collection
// Note: distinctId and email already have unique indexes from schema definition
UserSchema.index({ name: 1 }); // For text search functionality

export const User = mongoose.model<IUser>("User", UserSchema);

interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  device?: string;
}

const SessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  device: { type: String },
});

// Essential indexes for Session collection
SessionSchema.index({ userId: 1, startTime: -1 }); // Most critical: user sessions in time order

export const Session = mongoose.model<ISession>("Session", SessionSchema);

interface IEvent extends Document {
  sessionId: mongoose.Types.ObjectId;
  type: "search" | "page_view" | "add_to_cart" | "upsell" | "checkout";
  page?: string;
  timestamp: Date;
  metadata?: object;
}

const EventSchema = new Schema<IEvent>({
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
  type: {
    type: String,
    enum: ["search", "page_view", "add_to_cart", "upsell", "checkout"],
    required: true,
  },
  page: { type: String },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
});

// Essential indexes for Event collection
EventSchema.index({ sessionId: 1, timestamp: -1 }); // Most critical: session events in time order
EventSchema.index({ timestamp: -1 }); // For time-based analytics and queries

export const Event = mongoose.model<IEvent>("Event", EventSchema);
