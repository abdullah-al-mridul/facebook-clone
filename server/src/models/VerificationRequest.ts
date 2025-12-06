import mongoose, { Schema, Document } from "mongoose";

export interface IVerificationRequest extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  dob: Date;
  country: string;
  address: string;
  documentType: "Passport" | "National ID Card" | "Driver's License";
  documentUrl: string;
  status: "Pending" | "Approved" | "Denied";
  createdAt: Date;
  updatedAt: Date;
}

const VerificationRequestSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    documentType: {
      type: String,
      enum: ["Passport", "National ID Card", "Driver's License"],
      required: true,
    },
    documentUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVerificationRequest>(
  "VerificationRequest",
  VerificationRequestSchema
);
