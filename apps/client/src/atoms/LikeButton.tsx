import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LIKE_POST } from "../util/GraphQL";
import { Button } from "../components/ui/button";

export function LikeButton({ post: { id, likeCount, likes }, user, showLabel = true }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(Boolean(user && likes.find((like: { username: any }) => like.username === user.username)));
  }, [likes, user]);

  const [likePostMutation] = useMutation<any>(LIKE_POST, { variables: { PostId: id } });

  const button = (
    <Button variant={liked ? "destructive" : "outline"} onClick={(e) => { e.preventDefault(); if (user) likePostMutation(); }} title="Like Post">
      ❤️
    </Button>
  );

  return user ? <div style={{ display: "inline-flex", gap: ".35rem", alignItems: "center" }}>{button}{showLabel ? <span>{likeCount}</span> : null}</div> : <Link to="/login" style={{ display: "inline-flex", gap: ".35rem", alignItems: "center" }}>{button}{showLabel ? <span>{likeCount}</span> : null}</Link>;
}
