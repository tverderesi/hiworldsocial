import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Form, Card } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/GraphQL';
import { useForm } from '../util/hooks';

export default function NewPost() {
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data: any = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] },
      });
      values.body = '';
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Card
          fluid
          style={{ height: '100%' }}
        >
          <Card.Content color='black'>
            <Card.Header>
              <h3>New Post</h3>
              {error && (
                <p
                  className='ui error'
                  style={{
                    fontSize: '1rem',
                    color: '#9f3a38',
                    fontWeight: '400',
                  }}
                >
                  {error.graphQLErrors[0].message}!
                </p>
              )}
            </Card.Header>

            <Card.Description style={{ marginTop: '1rem' }}>
              <Form.Field>
                <Form.Input
                  placeholder='Say hi to the World!'
                  name='body'
                  onChange={onChange}
                  value={values.body}
                  error={error ? true : false}
                />
              </Form.Field>
            </Card.Description>
          </Card.Content>

          <Card.Content
            extra
            textAlign='right'
            style={{ display: 'flex', justifyContent: 'end' }}
          >
            <Button
              type='submit'
              color='purple'
            >
              Send
            </Button>
          </Card.Content>
        </Card>
      </Form>
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      commentCount
      likeCount
      comments {
        id
        createdAt
        username
        body
      }
      likes {
        id
        createdAt
      }
    }
  }
`;
