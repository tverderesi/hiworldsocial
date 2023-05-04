import moment from "moment";
import { Comment, Header } from "semantic-ui-react";
import { DeleteButton } from "../atoms/DeleteButton";
import { DELETE_COMMENT_MUTATION } from "../util/GraphQL";
import NewComment from "./NewComment";
import { getPictureURL } from "../util/profilePictureDictionary";
export default function Comments({ comments, commentCount, id, user }) {
  return (
    <Comment.Group>
      <Header as="h3" dividing>
        {commentCount} Comments
      </Header>

      {comments.map((comment: any, index: number) => (
        <Comment key={index}>
          <div style={{ position: "absolute", right: "0" }}>
            <DeleteButton
              user={user}
              username={comment.username}
              mutation={DELETE_COMMENT_MUTATION}
              postId={id}
              commentId={comment.id}
              basic
            />
          </div>

          <Comment.Avatar src={getPictureURL(comment.profilePicture)} />
          <Comment.Content>
            <Comment.Author>{comment.username}</Comment.Author>
            <Comment.Metadata>
              <div>{moment(comment.createdAt).fromNow()}</div>
            </Comment.Metadata>
            <Comment.Text>{comment.body}</Comment.Text>
          </Comment.Content>
        </Comment>
      ))}

      <NewComment id={id} />
    </Comment.Group>
  );
}
