import { useQuery } from "@apollo/client/react";
import moment from "moment";
import { useParams, Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import spinner from "../atoms/3-dots-bounce.svg";
import { LikeButton } from "../atoms/LikeButton";
import Comments from "../components/Comments";
import { DELETE_POST, GET_POST } from "../util/GraphQL";
import { AuthContext } from "../context/auth";
import { LikeLine } from "../atoms/LikeLine";
import { DeleteButton } from "../atoms/DeleteButton";
import { getPictureURL } from "../util/profilePictureDictionary";
import { LikePictures } from "../atoms/LikePictures";
import { Card, CardContent } from "../components/ui/card";

export default function SinglePost() {
  const { user } = useContext(AuthContext) as any;
  const { id } = useParams();
  const { loading, data } = useQuery<any>(GET_POST, { variables: { postId: id } });
  const post = data?.getPost;

  return (
    <div className="page-shell" style={{ margin: "5vh auto" }}>
      <Outlet />
      {loading ? <h2 style={{ width: "100%", display: "flex", justifyContent: "center" }}>Loading post <img src={spinner} style={{ position: "relative", top: ".5rem", left: ".5rem" }} alt="..." /></h2> : (
        <Card>
          {!post && <h2 style={{ width: "100%", display: "flex", justifyContent: "center", padding: "3rem" }}>Error! No post could be found.</h2>}
          {post && (
            <CardContent>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(34,36,38,.15)", paddingBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Link to={`/posts/${id}/profile/${post.username}`}><img src={getPictureURL(post.profilePicture) as any} alt={post.username} className="avatar" style={{ width: "70px", height: "70px" }} /></Link>
                  <div><h3 style={{ margin: 0 }}>{post.username}</h3><div>{moment(post.createdAt).fromNow()}</div></div>
                </div>
                <div style={{ display: "flex", gap: ".5rem" }}><LikeButton post={post} user={user} showLabel={false} /><DeleteButton user={user} username={post.username} mutation={DELETE_POST} postId={id} basic /></div>
              </div>
              <div className="grid-2" style={{ marginTop: "2rem" }}>
                <div className="post-style">{post.body}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}><LikePictures post={post} /><LikeLine post={post} user={user} /></div>
                  <Comments commentCount={post.commentCount} comments={post.comments} id={id} user={user} />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
