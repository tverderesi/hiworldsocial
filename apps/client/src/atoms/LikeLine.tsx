import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function LikeLine({ post: { likes }, user }) {
  const { t } = useTranslation();
  const likeLength = likes?.length;
  const displayName = (username: string) => username === user?.username ? t("likes.you") : username;

  if (likes) {
    switch (true) {
      case likeLength === 1:
        if (likes[0].username === user?.username) {
          return <p>{t("likes.youLiked")}</p>;
        } else {
          return (
            <p>
              <Link to={`/profile/${likes[0].username}`}>{likes[0].username}</Link>{" "}
              {t("likes.likedThisSingular")}
            </p>
          );
        }

      case likeLength === 2:
        return (
          <p>
            <strong>{displayName(likes[1].username)}</strong>{" "}
            {t("likes.and")}{" "}
            <strong>
              <Link to={`/profile/${likes[0].username}`}>
                {displayName(likes[0].username)}
              </Link>
            </strong>{" "}
            {t("likes.likedThisPlural")}
          </p>
        );

      case likeLength === 3:
        return (
          <p>
            <strong>
              <Link to={`/profile/${likes[2].username}`}>
                {displayName(likes[2].username)}
              </Link>
            </strong>
            ,{" "}
            <strong>
              <Link to={`/profile/${likes[1].username}`}>
                {displayName(likes[1].username)}
              </Link>
            </strong>{" "}
            {t("likes.and")}{" "}
            <strong>
              <Link to={`/profile/${likes[0].username}`}>
                {displayName(likes[0].username)}
              </Link>
            </strong>{" "}
            {t("likes.likedThisPlural")}
          </p>
        );

      case likeLength > 3:
        return (
          <p>
            <strong>
              <Link to={`/profile/${likes[2].username}`}>
                {displayName(likes[2].username)}
              </Link>
            </strong>
            ,
            <strong>
              {" "}
              <Link to={`/profile/${likes[1].username}`}>
                {displayName(likes[1].username)}
              </Link>
            </strong>
            ,{" "}
            <strong>
              <Link to={`/profile/${likes[0].username}`}>
                {displayName(likes[0].username)}
              </Link>
            </strong>
            {` ${t("likes.and")} ${t("likes.others", { count: likeLength - 3 })} ${t("likes.likedThisPlural")}`}
          </p>
        );

      default:
        return <p>{t("likes.nobody")}</p>;
    }
  } else return <></>;
}
