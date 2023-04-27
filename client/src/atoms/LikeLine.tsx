export function LikeLine({ post: { likes }, user: { username } }) {
  console.log(likes);
  const likeLength = likes?.length;
  console.log(username);

  if (likes) {
    switch (true) {
      case likeLength === 1:
        if (likes[0].username === username) {
          return <p>You liked this.</p>;
        } else {
          return <p>{`${likes[0].username} liked this.`}</p>;
        }

      case likeLength === 2:
        return (
          <p>
            <strong>{`${
              likes[1].username === username ? 'You' : likes[1].username
            }`}</strong>{' '}
            and{' '}
            <strong>{`${
              likes[0].username === username ? 'You' : likes[0].username
            }`}</strong>{' '}
            liked this.
          </p>
        );

      case likeLength === 3:
        return (
          <p>
            <strong>{`${
              likes[2].username === username ? 'You' : likes[2].username
            }`}</strong>
            ,{' '}
            <strong>{`${
              likes[1].username === username ? 'You' : likes[1].username
            }`}</strong>{' '}
            and{' '}
            <strong>{`${
              likes[0].username === username ? 'You' : likes[0].username
            }`}</strong>{' '}
            liked this.
          </p>
        );

      case likeLength > 3:
        return (
          <p>
            <strong>{`${
              likes[2].username === username ? 'You' : likes.username[2]
            }`}</strong>
            ,
            <strong>
              {' '}
              {`${likes[1].username === username ? 'You' : likes.username[1]}`}
            </strong>
            ,
            <strong>{`${
              likes[0].username === username ? 'You' : likes.username[0]
            }`}</strong>
            and ${likeLength - 3} more people liked this.
          </p>
        );

      default:
        return <p>Nobody Liked This</p>;
    }
  } else return <></>;
}
