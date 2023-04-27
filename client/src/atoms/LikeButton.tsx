/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Popup } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LIKE_POST } from "../util/GraphQL";

export function LikeButton({
  post: { id, likeCount, likes },
  user,
  showLabel = true,
}) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (
      user &&
      likes.find((like: { username: any }) => like.username === user.username)
    ) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes, user]);

  const likePost = (e: React.SyntheticEvent) => {
    e.preventDefault();
    likePostMutation();
  };

  const [likePostMutation] = useMutation(LIKE_POST, {
    variables: { PostId: id },
  });
  //I'm deeply ashamed the folowwing block of code exists
  return (
    <>
      {user && showLabel && (
        <Popup
          content="Like Post"
          inverted
          trigger={
            <Button
              basic={!liked ? true : false}
              color="red"
              icon="heart"
              label={{
                color: "red",
                content: likeCount,
              }}
              onClick={likePost}
            />
          }
        />
      )}
      {!user && showLabel && (
        <Popup
          content="Like Post"
          inverted
          trigger={
            <Button
              as={Link}
              to={"/login"}
              basic
              color="red"
              icon="heart"
              label={{
                color: "red",
                content: likeCount,
              }}
            />
          }
        />
      )}
      {user && !showLabel && (
        <Popup
          content="Like Post"
          inverted
          trigger={
            <Button
              basic={!liked ? true : false}
              color="red"
              icon="heart"
              onClick={likePost}
            />
          }
        />
      )}
      {!user && !showLabel && (
        <Popup
          content="Like Post"
          inverted
          trigger={
            <Button as={Link} to={"/login"} basic color="red" icon="heart" />
          }
        />
      )}
    </>
  );
}
