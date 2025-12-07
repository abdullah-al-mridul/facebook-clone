import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
  description: string;
  privacy: "public" | "private";
  coverUrl: string;
  members: mongoose.Types.ObjectId[];
  admins: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    coverUrl: { type: String, default: "" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IGroup>("Group", GroupSchema);
