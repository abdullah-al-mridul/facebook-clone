import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type:
    | "like"
    | "comment"
    | "friend_request"
    | "accept_friend_request"
    | "group_invite"
    | "system";
  referenceId?: mongoose.Types.ObjectId; // ID of the post, comment, etc.
  onModel?: string; // 'Post', 'Comment', 'Group'
  content: string; // "John liked your post"
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "friend_request",
        "accept_friend_request",
        "group_invite",
        "system",
      ],
      required: true,
    },
    referenceId: { type: Schema.Types.ObjectId, refPath: "onModel" },
    onModel: { type: String, enum: ["Post", "Comment", "Group"] },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
