import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FETCH_POSTS_QUERY } from "../util/GraphQL";
import { Button } from "../components/ui/button";
import { ConfirmDialog } from "../components/ui/dialog";

export function DeleteButton({ user, username, postId, commentId, callback, mutation, basic = false }: any): JSX.Element {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const title = commentId ? t("dialogs.deleteComment") : t("dialogs.deletePost");

  const [deleteCommentorPostMutation] = useMutation<any>(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY }) as any;
        const remaningPosts = data.getPosts.filter((post) => post.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: [...remaningPosts] } });
      }
      if (callback) callback();
    },
    variables: { postId, commentId },
  });

  if (!(user && user.username === username)) return <></>;

  return (
    <>
      <Button variant={basic ? "ghost" : "outline"} onClick={() => setConfirmOpen(true)} title={title}>
        {commentId ? "✕" : "🗑"}
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        title={title}
        description={t("dialogs.destructiveDescription")}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void deleteCommentorPostMutation()}
      />
    </>
  );
}

export default function MyPopup({ children }) {
  return <>{children}</>;
}
