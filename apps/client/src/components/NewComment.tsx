import { useMutation } from "@apollo/client/react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { CREATE_COMMENT_MUTATION } from "../util/GraphQL";
import { useForm } from "../util/hooks";

export default function NewComment({ id }) {
  const { onChange, onSubmit, values } = useForm(createCommentCallback, { body: "" });
  const [createComment, { error }] = useMutation<any>(CREATE_COMMENT_MUTATION, {
    variables: { postId: id, body: values.body },
    update() { values.body = ""; },
  });

  function createCommentCallback() { createComment(); }

  return (
    <form onSubmit={onSubmit} style={{ marginTop: "2rem" }}>
      {error && <p className="error-text">Could not add comment.</p>}
      <Textarea placeholder="Add your comment" name="body" onChange={onChange} value={values.body} />
      <div style={{ marginTop: ".75rem" }}><Button type="submit">Add Comment</Button></div>
    </form>
  );
}
