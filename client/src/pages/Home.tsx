import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Grid } from 'semantic-ui-react';
import Post from '../components/Post';

function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY); //can't destructure here or else TS will scream
  const posts = data?.getPosts;
  return (
    <>
      <Grid columns={3}>
        <Grid.Row>
          <h1 className='page-title'>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {loading ? (
            <h1>Loading</h1>
          ) : (
            posts &&
            posts.map((post: any) => (
              <Grid.Column key={post.id}>
                <Post post={post} />
              </Grid.Column>
            ))
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      commentCount
      likeCount
      comments {
        id
        createdAt
        username
        body
      }
      likes {
        id
        createdAt
        username
      }
    }
  }
`;

export default Home;
