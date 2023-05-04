export function LikeLine({ post: { likes }, user }) {
  const likeLength = likes?.length;
  if (likes) {
    switch (true) {
      case likeLength === 1:
        if (likes[0].username === user?.username) {
          return <p>You liked this.</p>;
        } else {
          return <p>{`${likes[0].username} liked this.`}</p>;
        }

      case likeLength === 2:
        return (
          <p>
            <strong>{`${
              likes[1].username === user?.username ? "You" : likes[1].username
            }`}</strong>{" "}
            and{" "}
            <strong>{`${
              likes[0].username === user?.username ? "You" : likes[0].username
            }`}</strong>{" "}
            liked this.
          </p>
        );

      case likeLength === 3:
        return (
          <p>
            <strong>{`${
              likes[2].username === user?.username ? "You" : likes[2].username
            }`}</strong>
            ,{" "}
            <strong>{`${
              likes[1].username === user?.username ? "You" : likes[1].username
            }`}</strong>{" "}
            and{" "}
            <strong>{`${
              likes[0].username === user?.username ? "You" : likes[0].username
            }`}</strong>{" "}
            liked this.
          </p>
        );

      case likeLength > 3:
        return (
          <p>
            <strong>{`${
              likes[2].username === user?.username ? "You" : likes[2].username
            }`}</strong>
            ,
            <strong>
              {" "}
              {`${
                likes[1].username === user?.username ? "You" : likes[1].username
              }`}
            </strong>
            ,{" "}
            <strong>{`${
              likes[0].username === user?.username ? "You" : likes[0].username
            }`}</strong>
            {` and ${likeLength - 3} more  ${
              likeLength - 3 === 1 ? "person" : "people"
            } liked this.`}
          </p>
        );

      default:
        return <p>Nobody Liked This</p>;
    }
  } else return <></>;
}
