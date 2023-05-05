import { Link } from "react-router-dom";

export function LikeLine({ post: { likes }, user }) {
  const likeLength = likes?.length;
  if (likes) {
    switch (true) {
      case likeLength === 1:
        if (likes[0].username === user?.username) {
          return <p>You liked this.</p>;
        } else {
          return (
            <p>
              <Link to={`/profile/${likes[0].username}`}>
                {`${likes[0].username}`}
              </Link>{" "}
              liked this.
            </p>
          );
        }

      case likeLength === 2:
        return (
          <p>
            <strong>{`${
              likes[1].username === user?.username ? "You" : likes[1].username
            }`}</strong>{" "}
            and{" "}
            <strong>
              <Link to={`/profile/${likes[0].username}`}>
                {`${
                  likes[0].username === user?.username
                    ? "You"
                    : likes[0].username
                }`}
              </Link>
            </strong>{" "}
            liked this.
          </p>
        );

      case likeLength === 3:
        return (
          <p>
            <strong>
              <Link to={`/profile/${likes[2].username}`}>
                {`${
                  likes[2].username === user?.username
                    ? "You"
                    : likes[2].username
                }`}
              </Link>
            </strong>
            ,{" "}
            <strong>
              <Link to={`/profile/${likes[1].username}`}>
                {`${
                  likes[1].username === user?.username
                    ? "You"
                    : likes[1].username
                }`}
              </Link>
            </strong>{" "}
            and{" "}
            <strong>
              <Link to={`/profile/${likes[0].username}`}>
                {`${
                  likes[0].username === user?.username
                    ? "You"
                    : likes[0].username
                }`}
              </Link>
            </strong>{" "}
            liked this.
          </p>
        );

      case likeLength > 3:
        return (
          <p>
            <strong>
              <Link to={`/profile/${likes[2].username}`}>
                {`${
                  likes[2].username === user?.username
                    ? "You"
                    : likes[2].username
                }`}
              </Link>
            </strong>
            ,
            <strong>
              {" "}
              <Link to={`/profile/${likes[1].username}`}>
                {`${
                  likes[1].username === user?.username
                    ? "You"
                    : likes[1].username
                }`}
              </Link>
            </strong>
            ,{" "}
            <strong>
              <Link to={`/profile/${likes[0].username}`}>
                {`${
                  likes[0].username === user?.username
                    ? "You"
                    : likes[0].username
                }`}
              </Link>
            </strong>
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
