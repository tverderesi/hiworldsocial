import { useQuery } from '@apollo/react-hooks';
import { useContext } from 'react';
import { Container, Grid, Transition } from 'semantic-ui-react';
import Ad from '../components/Ad';
import NewPost from '../components/NewPost';
import Post from '../components/Post';
import { AuthContext } from '../context/auth';
import { FETCH_POSTS_QUERY } from '../util/GraphQL';

function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY); //can't destructure here or else TS will scream
  const posts = data?.getPosts;
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <Grid columns={3}>
        <Grid.Row style={{ marginBottom: '-2rem' }}>
          <h1 className='page-title'>Recent Posts</h1>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column style={{ marginTop: '2rem ' }}>
            {user ? <NewPost /> : <Ad />}
          </Grid.Column>

          {loading ? (
            <h1>Loading</h1>
          ) : (
            posts &&
            posts.map((post: any) => (
              <Transition.Group key={post.id}>
                <Grid.Column
                  style={{ marginTop: '2rem ' }}
                  key={post.id}
                >
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
