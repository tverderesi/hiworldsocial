import { Card, Image } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';
import { LikeButton } from '../atoms/LikeButton';
import { DeletePost } from '../atoms/DeletePost';
import { CommentButton } from '../atoms/CommentButton';

export default function Post({
  post: { body, createdAt, username, likeCount, commentCount, id, likes },
}: {
  post: any;
}) {
  const { user } = useContext(AuthContext) as any;

  return (
    <>
      <Card
        fluid
        style={{ height: '100%' }}
      >
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            style={{
              borderRadius: '50%',
              height: '50px',
              width: '50px',
              position: 'absolute',
              right: '8px',
              top: '8px',
              zIndex: '1',
            }}
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta
            as={Link}
            to={`/posts/${id}`}
          >
            {moment(createdAt).fromNow(true)}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content
          extra
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ width: 'calc(100% - 40px)' }}>
            <CommentButton
              id={id}
              commentCount={commentCount}
            />

            <LikeButton
              post={{ id, likeCount, likes }}
              user={user}
              showLabel={true}
            />
          </div>

          <DeletePost
            user={user}
            username={username}
          />
        </Card.Content>
      </Card>
    </>
  );
}
