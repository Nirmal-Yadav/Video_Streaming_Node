// import { User } from "../models/user.model.js";
// import { Subscriber } from "../models/subscriptions.model.js";
import mongoose from "mongoose";
import { User } from "../../models/user.model.js";
import { Subscriber } from "../../models/subscriptions.model.js";

export const resolvers = {
  Query: {
    // ✅ Get User Channel Profile
    getUserChannelProfile: async (_, { username }, { user }) => {
      if (!username?.trim()) {
        throw new Error("Username is missing");
      }

      const channel = await User.aggregate([
        {
          $match: { username: username.toLowerCase() },
        },
        {
          $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers",
          },
        },
        {
          $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo",
          },
        },
        {
          $addFields: {
            subscribersCount: { $size: "$subscribers" },
            channelsSubscribedToCount: { $size: "$subscribedTo" },
            isSubscribed: {
              $in: [user?._id, "$subscribers.subscriber"],
            },
          },
        },
        {
          $project: {
            fullName: 1,
            username: 1,
            subscribersCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1,
          },
        },
      ]);

      if (!channel?.length) {
        throw new Error("Channel does not exist");
      }

      return channel[0];
    },

    // ✅ Get Watch History
    getWatchHistory: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      const watchHistory = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(user._id) },
        },
        {
          $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "watchHistory",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "owner",
                  foreignField: "_id",
                  as: "owner",
                  pipeline: [
                    {
                      $project: { fullName: 1, username: 1, avatar: 1 },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  owner: { $first: "$owner" },
                },
              },
            ],
          },
        },
      ]);

      return watchHistory[0]?.watchHistory || [];
    },
  },

  Mutation: {
    // ✅ Subscribe to a Channel
    subscribeToChannel: async (_, { channelId }, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      console.log(user._id, "user..");

      if (user._id.toString() === channelId) {
        throw new Error("You cannot subscribe to your own channel");
      }

      // Check if already subscribed
      const existingSubscription = await Subscriber.findOne({
        subscriber: user._id,
        channel: channelId,
      });

      if (existingSubscription) {
        throw new Error("You are already subscribed to this channel");
      }

      // Create subscription
      const subscription = await Subscriber.create({
        subscriber: user._id,
        channel: channelId,
      });

      return subscription.populate("subscriber channel");
    },

    // ✅ Unsubscribe from a Channel
    unsubscribeFromChannel: async (_, { channelId }, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      const subscription = await Subscriber.findOneAndDelete({
        subscriber: user._id,
        channel: channelId,
      });

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      return "Unsubscribed successfully";
    },
  },
};
