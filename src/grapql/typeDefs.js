import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    _id: ID!
    fullName: String!
    username: String!
    email: String!
    avatar: String
    coverImage: String
    subscribersCount: Int
    isSubscribed: Boolean
  }

  type Subscription {
    _id: ID!
    subscriber: User!
    channel: User!
    createdAt: String!
    updatedAt: String!
  }

  type Video {
    _id: ID!
    title: String!
    description: String!
    owner: User!
  }

  type Query {
    getUserChannelProfile(username: String!): User
    getWatchHistory: [Video]
  }

  type Mutation {
    subscribeToChannel(channelId: ID!): Subscription!
    unsubscribeFromChannel(channelId: ID!): String
  }
`;
