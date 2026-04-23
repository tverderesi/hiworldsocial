import { model, Schema } from "mongoose";

import type { PostShape } from "../types.js";

const postSchema = new Schema<PostShape>({
  body: String,
  username: String,
  createdAt: String,
  profilePicture: String,
  comments: [
    {
      body: String,
      createdAt: String,
      username: String,
      profilePicture: String,
    },
  ],
  likes: [{ username: String, createdAt: String, profilePicture: String }],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

export default model<PostShape>("Post", postSchema);
