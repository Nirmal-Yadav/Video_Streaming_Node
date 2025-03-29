import mongoose, { model, Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who is subcribing
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, // one whom to subscribe
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subcription = model("Subscription", subscriptionModel);
