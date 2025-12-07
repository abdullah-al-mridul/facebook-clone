import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  group?: mongoose.Types.ObjectId;
  content: string;
  images: string[];
  videoUrl?: string;
  postType: "text" | "image" | "video";
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  shares: number;
  views: number;
  privacy: "public" | "friends" | "private";
  createdAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    content: { type: String, required: true },
    images: [{ type: String }],
    videoUrl: { type: String },
    postType: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    privacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
