import { useMutation } from '@apollo/client';

import { Button, Form } from 'semantic-ui-react';

import { CREATE_COMMENT_MUTATION } from '../util/GraphQL';
import { useForm } from '../util/hooks';

export default function NewComment({ id }) {
  const { onChange, onSubmit, values } = useForm(createCommentCallback, {
    body: '',
  });
  console.log(values.body);
  const [createComment, { error }] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: { postId: id, body: values.body },
    update() {
      values.body = '';
    },
  });

  function createCommentCallback() {
    createComment();
  }

  return (
    <>
      <Form
        onSubmit={onSubmit}
        style={{ marginTop: '2rem' }}
      >
        {error && (
          <p
            className='ui error'
            style={{
              fontSize: '1rem',
              color: '#9f3a38',
              fontWeight: '400',
            }}
          ></p>
        )}

        <Form.Field>
          <Form.TextArea
            placeholder='Add your comment'
            name='body'
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
        </Form.Field>

        <Button
          content='Add Comment'
          labelPosition='left'
          icon='edit'
          color='purple'
        />
      </Form>
    </>
  );
}
