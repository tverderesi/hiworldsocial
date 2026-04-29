import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Button, Popup, Confirm } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { FETCH_POSTS_QUERY } from "../util/GraphQL";

export function DeleteButton({
  user,
  username,
  postId,
  commentId,
  callback,
  mutation,
  basic = false,
}: {
  user: any;
  username: any;
  postId?: any;
  commentId?: any;
  callback?: any;
  mutation: any;
  basic?: boolean;
}): JSX.Element {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteLabel = commentId ? t("dialogs.deleteComment") : t("dialogs.deletePost");

  const [deleteCommentorPostMutation] = useMutation<any>(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY }) as any;
        const remaningPosts = data.getPosts.filter(
          (post) => post.id !== postId
        );
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: [...remaningPosts] },
        });
      }
      if (callback) {
        callback();
      }
    },
    variables: { postId: postId, commentId: commentId },
  });

  return (
    <>
      <MyPopup content={deleteLabel}>
        {user && user.username === username && (
          <Popup
            content={deleteLabel}
            inverted
            trigger={
              <div style={{ width: "40px" }}>
                <Button
                  color="purple"
                  icon={commentId ? "times" : "trash"}
                  style={{
                    position: "absolute",
                    boxShadow: commentId ? "none" : "",
                  }}
                  onClick={() => setConfirmOpen(true)}
                  basic={basic}
                  className="DeleteComment"
                />
              </div>
            }
          />
        )}
      </MyPopup>
      <Confirm
        open={confirmOpen}
        cancelButton={t("actions.cancel")}
        confirmButton={t("actions.confirm")}
        content={t("dialogs.destructiveDescription")}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={(e: React.SyntheticEvent) => {
          e.preventDefault();
          deleteCommentorPostMutation();
        }}
      />
    </>
  );
}

function MyPopup({ content, children }) {
  return <Popup inverted content={content} trigger={children} />;
}

export default MyPopup;
