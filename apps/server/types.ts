import type { Request, Response } from "express";
import type { HydratedDocument, Types } from "mongoose";

export interface GraphQLContext {
  req?: Request;
  res?: Response;
}

export interface ValidationResult {
  errors: Record<string, string>;
  valid: boolean;
}

export interface TokenUser {
  id: string;
  email: string;
  username: string;
  profilePicture: string;
}

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  profilePicture: string;
  token?: string | null;
}

export interface UserShape {
  username: string;
  password: string;
  email: string;
  createdAt: string;
  profilePicture: string;
  passwordResetTokenHash?: string | null;
  passwordResetExpiresAt?: string | null;
  passwordResetRequestedAt?: string | null;
  passwordResetRequestCount?: number;
}

export type UserDocument = HydratedDocument<UserShape>;

export type AuthUserPayload = PublicUser & {
  id: string;
  _id?: Types.ObjectId;
  __v?: number;
};

export type UserResolverResult = UserDocument | AuthUserPayload;

export interface PostComment {
  _id?: Types.ObjectId;
  id?: string;
  body: string;
  createdAt: string;
  username: string;
  profilePicture: string;
}

export interface PostLike {
  _id?: Types.ObjectId;
  id?: string;
  username: string;
  createdAt: string;
  profilePicture: string;
}

export interface PostShape {
  body: string;
  username: string;
  createdAt: string;
  profilePicture: string;
  comments: PostComment[];
  likes: PostLike[];
  user: Types.ObjectId;
}

export type PostDocument = HydratedDocument<PostShape>;
