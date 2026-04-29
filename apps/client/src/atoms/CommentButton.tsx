import { Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function CommentButton({ id, commentCount, showLabel = true }) {
  const { t } = useTranslation();
  return showLabel ? (
    <Popup
      inverted
      content={t("actions.commentOnPost")}
      trigger={
        <Button
          as={Link}
          to={`/posts/${id}`}
          basic={!commentCount ? true : false}
          color="blue"
          icon="comment alternate"
          label={{
            basic: true,
            color: "blue",
            content: commentCount,
          }}
        />
      }
    />
  ) : (
    <Popup
      inverted
      content={t("actions.commentOnPost")}
      trigger={
        <Button
          as={Link}
          to={`/posts/${id}`}
          basic={!commentCount ? true : false}
          color="blue"
          icon="comment alternate"
        />
      }
    />
  );
}
