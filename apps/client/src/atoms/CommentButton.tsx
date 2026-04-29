import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button";

export function CommentButton({ id, commentCount, showLabel = true }) {
  const { t } = useTranslation();

  return (
    <Link to={`/posts/${id}`} title={t("actions.commentOnPost")} style={{ display: "inline-flex", alignItems: "center", gap: ".35rem" }}>
      <Button variant={commentCount ? "default" : "outline"}>💬</Button>
      {showLabel ? <span>{commentCount}</span> : null}
    </Link>
  );
}
