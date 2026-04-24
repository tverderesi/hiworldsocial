import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export function CommentButton({ id, commentCount, showLabel = true }) {
  return (
    <Link to={`/posts/${id}`} title="Comment on post" style={{ display: "inline-flex", alignItems: "center", gap: ".35rem" }}>
      <Button variant={commentCount ? "default" : "outline"}>💬</Button>
      {showLabel ? <span>{commentCount}</span> : null}
    </Link>
  );
}
