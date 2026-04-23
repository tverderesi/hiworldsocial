import { model, Schema } from "mongoose";

import type { UserShape } from "../types.js";

const userSchema = new Schema<UserShape>({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  profilePicture: String,
});

export default model<UserShape>("User", userSchema);
