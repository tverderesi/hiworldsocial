import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Button, Popup, Confirm } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/GraphQL';

export function DeleteButton({
  user,
  username,
  postId,
  commentId,
  callback,
  mutation,
  basic = false,
}: {
  user: any;
  username: any;
  postId?: any;
  commentId?: any;
  callback?: any;
  mutation: any;
  basic?: boolean;
}): JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteCommentorPostMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY }) as any;
        const remaningPosts = data.getPosts.filter(post => post.id !== postId);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: [...remaningPosts] },
        });
      }
      if (callback) {
        callback();
      }
    },
    variables: { postId: postId, commentId: commentId },
  });

  return (
    <>
      {' '}
      <>
        <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
          <div style={{ width: '40px' }}>
            {user && user.username === username && (
              <Button
                color='purple'
                icon={commentId ? 'times' : 'trash'}
                style={{
                  position: 'absolute',
                  boxShadow: commentId ? 'none' : '',
                }}
                onClick={() => setConfirmOpen(true)}
                basic={basic}
                className='DeleteComment'
              />
            )}
          </div>
        </MyPopup>
        <Confirm
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={(e: React.SyntheticEvent) => {
            e.preventDefault();
            deleteCommentorPostMutation();
          }}
        />
      </>
    </>
  );
}

function MyPopup({ content, children }) {
  return (
    <Popup
      inverted
      content={content}
      trigger={children}
    />
  );
}

export default MyPopup;
