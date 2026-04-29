import moment from "moment";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth";
import { LikeButton } from "../atoms/LikeButton";
import { DeleteButton } from "../atoms/DeleteButton";
import { CommentButton } from "../atoms/CommentButton";
import { DELETE_POST } from "../util/GraphQL";
import { getPictureURL } from "../util/profilePictureDictionary";
import Profile from "../pages/User";
import { useDisplayProfile } from "../util/hooks";
import { Card, CardContent, CardFooter } from "./ui/card";

export default function Post({ post: { body, createdAt, username, likeCount, commentCount, id, likes, profilePicture } }: { post: any }) {
  const { user } = useContext(AuthContext) as any;
  const { showProfile, setShowProfile } = useDisplayProfile(false);

  return (
    <Card>
      {showProfile && <Profile username={username} key={username} setProfileState={setShowProfile} />}
      <CardContent style={{ position: "relative" }}>
        <img src={getPictureURL(profilePicture)} className="avatar avatar-md" style={{ position: "absolute", right: "8px", top: "8px", cursor: "pointer" }} onClick={(e) => { e.preventDefault(); setShowProfile(true); }} />
        <div style={{ fontWeight: 700 }}>{username}</div>
        <Link to={`/posts/${id}`} style={{ color: "rgba(0,0,0,.6)", fontSize: ".9rem" }}>{moment(createdAt).fromNow()}</Link>
        <p>{body}</p>
      </CardContent>
      <CardFooter style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <CommentButton id={id} commentCount={commentCount} />
          <LikeButton post={{ id, likeCount, likes }} user={user} showLabel />
        </div>
        <DeleteButton user={user} username={username} mutation={DELETE_POST} postId={id} />
      </CardFooter>
    </Card>
  );
}
