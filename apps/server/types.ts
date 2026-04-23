import type { HydratedDocument, Types } from "mongoose";

export interface GraphQLContext {
  req: {
    headers: {
      authorization?: string;
    };
  };
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

export interface UserShape {
  username: string;
  password: string;
  email: string;
  createdAt: string;
  profilePicture: string;
}

export type UserDocument = HydratedDocument<UserShape>;

export type AuthUserPayload = UserShape & {
  id: string;
  token: string;
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
