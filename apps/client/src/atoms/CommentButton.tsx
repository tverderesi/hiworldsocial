import { Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";

export function CommentButton({ id, commentCount, showLabel = true }) {
  return showLabel ? (
    <Popup
      inverted
      content="Comment on post"
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
      content="Comment on post"
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
