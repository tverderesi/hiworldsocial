import { model, Schema } from "mongoose";

import type { UserShape } from "../types";

const userSchema = new Schema<UserShape>({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  profilePicture: String,
  passwordResetTokenHash: String,
  passwordResetExpiresAt: String,
  passwordResetRequestedAt: String,
  passwordResetRequestCount: Number,
});

export default model<UserShape>("User", userSchema);
