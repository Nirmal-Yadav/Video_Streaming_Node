import { Subscriber } from "../models/subscriptions.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Subscribe to a channel
const subscribeToChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id; // Logged-in user (subscriber)

  if (userId.toString() === channelId) {
    // from frontend channel automaticlly converted into string
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  // Check if already subscribed
  const existingSubscription = await Subscriber.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existingSubscription) {
    throw new ApiError(400, "You are already subscribed to this channel");
  }

  const subscription = await Subscriber.create({
    subscriber: userId,
    channel: channelId,
  });

  res
    .status(201)
    .json(new ApiResponse(201, subscription, "Subscribed successfully"));
});

// Unsubscribe from a channel
const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id; // Logged-in user (subscriber)

  const subscription = await Subscriber.findOneAndDelete({
    subscriber: userId,
    channel: channelId,
  });

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"));
});

export { subscribeToChannel, unsubscribeFromChannel };
