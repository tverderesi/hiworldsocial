import { useMutation } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { CREATE_COMMENT_MUTATION } from "../util/GraphQL";
import { useForm } from "../util/hooks";

export default function NewComment({ id }) {
  const { t } = useTranslation();
  const { onChange, onSubmit, values } = useForm(createCommentCallback, { body: "" });
  const [createComment, { error }] = useMutation<any>(CREATE_COMMENT_MUTATION, {
    variables: { postId: id, body: values.body },
    update() { values.body = ""; },
  });

  function createCommentCallback() { createComment(); }

  return (
    <form onSubmit={onSubmit} style={{ marginTop: "2rem" }}>
      {error && <p className="error-text">{t("newComment.error")}</p>}
      <Textarea placeholder={t("newComment.placeholder")} name="body" onChange={onChange} value={values.body} />
      <div style={{ marginTop: ".75rem" }}><Button type="submit">{t("actions.addComment")}</Button></div>
    </form>
  );
}
