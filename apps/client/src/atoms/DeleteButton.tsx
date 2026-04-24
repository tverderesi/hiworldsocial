import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { FETCH_POSTS_QUERY } from "../util/GraphQL";
import { Button } from "../components/ui/button";
import { ConfirmDialog } from "../components/ui/dialog";

export function DeleteButton({ user, username, postId, commentId, callback, mutation, basic = false }: any): JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      <Button variant={basic ? "ghost" : "outline"} onClick={() => setConfirmOpen(true)} title={commentId ? "Delete comment" : "Delete post"}>
        {commentId ? "✕" : "🗑"}
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        title={commentId ? "Delete comment" : "Delete post"}
        description="This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void deleteCommentorPostMutation()}
      />
    </>
  );
}

export default function MyPopup({ children }) {
  return <>{children}</>;
}
