import { Button, Form } from 'semantic-ui-react';
import { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';
import { REGISTER_USER } from '../util/GraphQL';

function Register() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const { onChange, onSubmit, values } = useForm(registerUser, initialState);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      navigate('/', { replace: true });
    },
    onError(err) {
      //@ts-ignore
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  function registerUser() {
    addUser();
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
        noValidate
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
          label='E-mail'
          placeholder='E-mail'
          name='email'
          //@ts-ignore
          value={values.email}
          onChange={onChange}
          //@ts-ignore
          error={errors.email ? true : false}
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
        <Form.Input
          type='password'
          label='Confirm Password'
          placeholder='Confirm Password'
          name='confirmPassword'
          //@ts-ignore
          value={values.confirmPassword}
          onChange={onChange}
          //@ts-ignore
          error={errors.confirmPassword ? true : false}
        />
        <Button
          type='submit'
          primary
          color='purple'
        >
          Register
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

export default Register;
