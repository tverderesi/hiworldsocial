import { useQuery } from "@apollo/client";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import spinner from "../atoms/3-dots-bounce.svg";
import { Grid, Container, Card } from "semantic-ui-react";
import { LikeButton } from "../atoms/LikeButton";
import Comments from "../components/Comments";
import { DELETE_POST, GET_POST } from "../util/GraphQL";
import { AuthContext } from "../context/auth";
import { LikeLine } from "../atoms/LikeLine";
import { DeleteButton } from "../atoms/DeleteButton";
import { getPictureURL } from "../util/profilePictureDictionary";
import { LikePictures } from "../atoms/LikePictures";
import { Link, Outlet } from "react-router-dom";

export default function SinglePost() {
  const { user } = useContext(AuthContext) as any;

  const { id } = useParams();

  const { loading, data } = useQuery(GET_POST, { variables: { postId: id } });
  const post = data?.getPost;

  //   body,
  // const {
  //   createdAt,
  //   username,
  //   comments,
  //   likes,
  //   likeCount,
  //   commentCount,
  // } = post;

  return (
    <Container
      style={{
        margin: "5vh auto ",
      }}
    >
      <Outlet />
      {loading ? (
        <h2
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          Loading post{" "}
          <img
            src={spinner}
            style={{ position: "relative", top: ".5rem", left: ".5rem" }}
            alt="..."
          />
        </h2>
      ) : (
        <Card fluid={true}>
          {!post && (
            <h2
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: "3rem",
              }}
            >
              Error! No post could be found.
            </h2>
          )}
          {post && (
            <Grid
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "start",
                padding: "3%",
              }}
            >
              <Grid.Row
                as={Card.Content}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginLeft: "3rem",
                  marginRight: "3rem",
                  borderBottom: "1px solid rgba(34,36,38,.15)",
                  margin: "0 1rem",
                }}
              >
                <Grid.Column
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0",
                    width: "auto",
                  }}
                >
                  <Link to={`/posts/${id}/profile/${post.username}`}>
                    <img
                      src={getPictureURL(post.profilePicture) as any}
                      alt={post.username}
                      className="BigPicture"
                      style={{ borderRadius: "50%" }}
                    />
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "1rem",
                    }}
                  >
                    <Card.Header className="ui title">
                      {post.username}
                    </Card.Header>
                    <Card.Meta>{moment(post.createdAt).fromNow()}</Card.Meta>
                  </div>
                </Grid.Column>
                <Grid.Column
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroudColor: "none",
                    padding: "0",
                    width: "auto",
                  }}
                >
                  <LikeButton post={post} user={user} showLabel={false} />
                  <DeleteButton
                    user={user}
                    username={post.username}
                    mutation={DELETE_POST}
                    postId={id}
                    basic
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ marginTop: "2rem" }} fluid>
                <Grid.Column
                  className="ui bottom left popup fakepopup transition visible post-style"
                  computer={8}
                  mobile={16}
                >
                  <div className="content">{post.body}</div>
                </Grid.Column>
                <Grid.Column computer={8} mobile={16}>
                  <Grid.Row style={{ display: "flex", alignItems: "center" }}>
                    <LikePictures post={post} />
                    <LikeLine post={post} user={user} />
                  </Grid.Row>
                  <Comments
                    commentCount={post.commentCount}
                    comments={post.comments}
                    id={id}
                    user={user}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
        </Card>
      )}
    </Container>
  );
}
