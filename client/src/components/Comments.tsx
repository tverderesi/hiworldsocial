import { Button, Comment, Form, Header } from 'semantic-ui-react';
export default function Comments({ comments, commentCount }) {
  return (
    <Comment.Group>
      <Header
        as='h3'
        dividing
      >
        {commentCount} Comments
      </Header>

      {comments.map((comment: any) => (
        <Comment>
          <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
          <Comment.Content>
            <Comment.Author as='a'>{comment.username}</Comment.Author>
            <Comment.Metadata>
              <div>Today at 5:42PM</div>
            </Comment.Metadata>
            <Comment.Text>{comment.body}</Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      ))}

      <Form reply>
        <Form.TextArea />
        <Button
          content='Add Reply'
          labelPosition='left'
          icon='edit'
          primary
        />
      </Form>
    </Comment.Group>
  );
}
