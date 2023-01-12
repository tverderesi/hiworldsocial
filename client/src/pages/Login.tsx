import { Button, Form } from 'semantic-ui-react';
import { useState, useContext } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

export default function Login() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const initialState = { username: '', password: '' };

  const { onChange, onSubmit, values } = useForm(
    loginUserCallback,
    initialState
  );

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      navigate('/', { replace: true });
    },
    onError(err) {
      //@ts-ignore
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1
        className='page-title'
        style={{ marginBottom: '2em', marginTop: '1em' }}
      >
        Register
      </h1>
      <Form
        onSubmit={onSubmit}
        noValidade
        style={{ width: '50%' }}
        className={loading ? 'loading' : ''}
      >
        <Form.Input
          label='Username'
          placeholder='Username'
          name='username'
          //@ts-ignore
          value={values.username}
          onChange={onChange}
          //@ts-ignore
          error={errors.username ? true : false}
        />

        <Form.Input
          type='password'
          label='Password'
          placeholder='Password'
          name='password'
          //@ts-ignore
          value={values.password}
          onChange={onChange}
          //@ts-ignore
          error={errors.password ? true : false}
        />

        <Button
          type='submit'
          primary
        >
          login
        </Button>
      </Form>
      {Object.keys(errors)?.length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((value: any) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      token
      username
      createdAt
    }
  }
`;
