import mongoose, { Schema, Document } from "mongoose";

export interface ISavedItem extends Document {
  user: mongoose.Types.ObjectId;
  post?: mongoose.Types.ObjectId;
  product?: mongoose.Types.ObjectId;
  type: "post" | "product";
  createdAt: Date;
}

const SavedItemSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    type: { type: String, enum: ["post", "product"], required: true },
  },
  { timestamps: true }
);

// Ensure user can save an item only once
SavedItemSchema.index({ user: 1, post: 1, product: 1 }, { unique: true });

export default mongoose.model<ISavedItem>("SavedItem", SavedItemSchema);
