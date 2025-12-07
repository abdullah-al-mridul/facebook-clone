import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  seller: mongoose.Types.ObjectId;
  name: string; // Title
  price: number;
  description: string;
  category: string;
  location: string;
  images: string[];
  isSold: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    isSold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
