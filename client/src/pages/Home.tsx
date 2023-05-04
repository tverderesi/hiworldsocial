import { useQuery } from "@apollo/react-hooks";
import { useContext } from "react";
import { Card, Container, Grid, Transition } from "semantic-ui-react";
import Ad from "../components/Ad";
import NewPost from "../components/NewPost";
import Post from "../components/Post";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/GraphQL";
import { relative } from "path";

function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY); //can't destructure here or else TS will scream
  const posts = data?.getPosts;
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <Grid columns={3} stackable>
        <Grid.Row style={{ margin: "1rem 0" }}>
          <h1 className="page-title">Recent Posts</h1>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column style={{ marginBottom: "2rem" }}>
            {user ? <NewPost /> : <Ad />}
          </Grid.Column>

          {loading ? (
            <Grid.Column style={{ marginBottom: "2rem" }}>
              <Card
                fluid
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "100%",
                  justiyContent: "center",
                  alignItems: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                  textAlign: "center",
                  verticalAlign: "center",
                }}
              >
                <h2 style={{ width: "100%" }}>
                  Loading posts
                  <img
                    src="spinner.svg"
                    alt=""
                    height={24}
                    style={{
                      position: "relative",
                      top: ".25rem",
                      left: "1rem",
                    }}
                  />
                </h2>
              </Card>
            </Grid.Column>
          ) : (
            posts &&
            posts.map((post: any) => (
              <Transition.Group key={post.id}>
                <Grid.Column style={{ marginBottom: "2rem" }} key={post.id}>
                  <Post post={post} />
                </Grid.Column>
              </Transition.Group>
            ))
          )}
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default Home;
