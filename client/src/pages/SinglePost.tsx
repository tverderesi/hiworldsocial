import { useQuery } from '@apollo/client';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';

import { Grid, Container, Image, Card } from 'semantic-ui-react';
import { LikeButton } from '../atoms/LikeButton';
import Comments from '../components/Comments';
import { GET_POST } from '../util/GraphQL';
import { AuthContext } from '../context/auth';
import { LikeLine } from '../atoms/LikeLine';

export default function SinglePost() {
  const { user } = useContext(AuthContext) as any;
  const { id } = useParams();

  const post = useQuery(GET_POST, { variables: { postId: id } }).data?.getPost;
  console.log(post ? post.likes[0] : '');
  // const {
  //   body,
  //   createdAt,
  //   username,
  //   comments,
  //   likes,
  //   likeCount,
  //   commentCount,
  // } = post;

  return (
    <Container style={{ marginTop: '5vh' }}>
      <Card fluid>
        {!post && <>ERROR PIU PIU PIU</>}
        {post && (
          <Grid
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'start',
              padding: '3%',
            }}
          >
            {' '}
            <Grid.Row
              as={Card.Content}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginLeft: '3rem',
                marginRight: '3rem',
                borderBottom: '1px solid rgba(34,36,38,.15)',
              }}
              className=' '
            >
              <Grid.Column
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0',
                  width: 'auto',
                }}
              >
                <Image
                  src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                  avatar
                  size='massive'
                  className='BigPicture'
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '1rem',
                  }}
                >
                  <Card.Header className='ui title'>
                    {post.username}
                  </Card.Header>
                  <Card.Meta>{moment(post.createdAt).fromNow()}</Card.Meta>
                </div>
              </Grid.Column>
              <Grid.Column
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroudColor: 'none',
                  padding: '0',
                  width: 'auto',
                }}
              >
                <LikeButton
                  post={post}
                  user={user}
                  showLabel={false}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ marginTop: '2rem' }}>
              <Grid.Column
                width={8}
                style={{ height: '80%' }}
              >
                <Grid.Row
                  as={Card.Content}
                  style={{
                    margin: '0 7% 7% 3rem',
                    fontSize: '1.1rem',
                  }}
                >
                  {post.body}
                </Grid.Row>
              </Grid.Column>
              <Grid.Column width={8}>
                <Grid.Row>{LikeLine(post)}</Grid.Row>
                <Comments
                  commentCount={post.commentCount}
                  comments={post.comments}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Card>
    </Container>
  );
}
