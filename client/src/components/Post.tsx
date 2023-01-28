import { Card, Image } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';
import { LikeButton } from '../atoms/LikeButton';
import { DeleteButton } from '../atoms/DeleteButton';
import { CommentButton } from '../atoms/CommentButton';
import { DELETE_POST } from '../util/GraphQL';
import { getPictureURL } from '../util/profilePictureDictionary';

export default function Post({
  post: {
    body,
    createdAt,
    username,
    likeCount,
    commentCount,
    id,
    likes,
    profilePicture,
  },
}: {
  post: any;
}) {
  const { user } = useContext(AuthContext) as any;

  return (
    <>
      <Card
        style={{ height: '100%' }}
        fluid
      >
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src={getPictureURL(profilePicture)}
            style={{
              borderRadius: '50%',
              height: '50px',
              width: '50px',
              position: 'absolute',
              right: '8px',
              top: '8px',
              zIndex: '1',
            }}
            rounded
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta
            as={Link}
            to={`/posts/${id}`}
          >
            {moment(createdAt).fromNow()}
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

          <DeleteButton
            user={user}
            username={username}
            mutation={DELETE_POST}
            postId={id}
          />
        </Card.Content>
      </Card>
    </>
  );
}
