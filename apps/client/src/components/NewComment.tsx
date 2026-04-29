import { useMutation } from "@apollo/client/react";

import { Button, Form } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

import { CREATE_COMMENT_MUTATION } from "../util/GraphQL";
import { useForm } from "../util/hooks";

export default function NewComment({ id }) {
  const { t } = useTranslation();
  const { onChange, onSubmit, values } = useForm(createCommentCallback, {
    body: "",
  });

  const [createComment, { error }] = useMutation<any>(CREATE_COMMENT_MUTATION, {
    variables: { postId: id, body: values.body },
    update() {
      values.body = "";
    },
  });

  function createCommentCallback() {
    createComment();
  }

  return (
    <>
      <Form onSubmit={onSubmit} style={{ marginTop: "2rem" }}>
        {error && (
          <p
            className="ui error"
            style={{
              fontSize: "1rem",
              color: "#9f3a38",
              fontWeight: "400",
            }}
          >{t("newComment.error")}</p>
        )}

        <Form.Field>
          <Form.TextArea
            placeholder={t("newComment.placeholder")}
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
        </Form.Field>

        <Button
          content={t("actions.addComment")}
          labelPosition="left"
          icon="edit"
          color="purple"
        />
      </Form>
    </>
  );
}
