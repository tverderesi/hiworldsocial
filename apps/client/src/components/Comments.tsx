import moment from "moment";
import { useTranslation } from "react-i18next";
import { DeleteButton } from "../atoms/DeleteButton";
import { DELETE_COMMENT_MUTATION } from "../util/GraphQL";
import NewComment from "./NewComment";
import { getPictureURL } from "../util/profilePictureDictionary";

export default function Comments({ comments, commentCount, id, user }) {
  const { t } = useTranslation();
  return (
    <div>
      <h3 style={{ borderBottom: "1px solid rgba(34,36,38,.15)", paddingBottom: ".5rem" }}>{t("comments.count", { count: commentCount })}</h3>
      <div style={{ display: "grid", gap: "1rem" }}>
        {comments.map((comment: any, index: number) => (
          <article key={index} style={{ position: "relative", paddingRight: "3rem" }}>
            <div style={{ position: "absolute", right: "0" }}>
              <DeleteButton user={user} username={comment.username} mutation={DELETE_COMMENT_MUTATION} postId={id} commentId={comment.id} basic />
            </div>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <img className="avatar avatar-sm" src={getPictureURL(comment.profilePicture)} />
              <div>
                <div style={{ fontWeight: 700 }}>{comment.username}</div>
                <div style={{ color: "rgba(0,0,0,.6)", fontSize: ".9rem" }}>{moment(comment.createdAt).fromNow()}</div>
                <div>{comment.body}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <NewComment id={id} />
    </div>
  );
}
