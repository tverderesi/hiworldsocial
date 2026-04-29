import { useMutation } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from "../util/GraphQL";
import { getGraphQLErrorMessage } from "../util/errors";
import { useForm } from "../util/hooks";

const MAX_POST_BODY_LENGTH = 512;

export default function NewPost() {
  const { t } = useTranslation();
  const { onChange, onSubmit, values } = useForm(createPostCallback, { body: "" });
  const [createPost, { error }] = useMutation<any>(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data: any = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      const resultData = result.data as { createPost: any };
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: [resultData.createPost, ...data.getPosts] } });
      values.body = "";
    },
  });

  function createPostCallback() { createPost(); }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <h3>{t("newPost.title")}</h3>
          {error && <p className="error-text">{getGraphQLErrorMessage(error)}{t("newPost.errorSuffix")}</p>}
        </CardHeader>
        <CardContent>
          <Textarea placeholder={t("newPost.placeholder")} name="body" onChange={onChange} value={values.body} maxLength={MAX_POST_BODY_LENGTH} />
          <div style={{ marginTop: ".5rem", textAlign: "right", fontSize: ".9rem", color: values.body.length >= MAX_POST_BODY_LENGTH ? "#9f3a38" : "#6b6b6b" }}>
            {values.body.length}/{MAX_POST_BODY_LENGTH}
          </div>
        </CardContent>
        <CardFooter style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit">{t("actions.send")}</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
