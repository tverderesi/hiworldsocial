import { Button, Card, Form, Grid, GridColumn, Image } from 'semantic-ui-react';
import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';
import { REGISTER_USER } from '../util/GraphQL';

function Register() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({}) as any;

  const initialState: any = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
  };

  const [profilePicture, setProfilePicture] = useState('');
  const [selected, setSelected] = useState(false);
  //prettier-ignore
  const [placeholderNames, setPlaceholderNames] = useState(
  [
      { name: 'ade', isSelected: false, v: 'v1' },
      { name: 'chris', isSelected: false, v: 'v1' },
      { name: 'christian', isSelected: false, v: 'v1' },
      { name: 'daniel', isSelected: false, v: 'v1' },
      { name: 'elliot', isSelected: false, v: 'v1' },
      { name: 'helen', isSelected: false, v: 'v1' },
      { name: 'joe', isSelected: false, v: 'v1' },
      { name: 'justen', isSelected: false, v: 'v1' },
      { name: 'laura', isSelected: false, v: 'v1' },
      { name: 'jenny', isSelected: false, v: 'v1' },
      { name: 'matt', isSelected: false, v: 'v1' },
      { name: 'nan', isSelected: false, v: 'v1' },
      { name: 'steve', isSelected: false, v: 'v1' },
      { name: 'stevie', isSelected: false, v: 'v1' },
      { name: 'veronika', isSelected: false, v: 'v1' },
      { name: 'elyse', isSelected: false, v: 'v2' },
      { name: 'kristy', isSelected: false, v: 'v2' },
      { name: 'lena', isSelected: false, v: 'v2' },
      { name: 'lindsay', isSelected: false, v: 'v2' },
      { name: 'mark', isSelected: false, v: 'v2' },
      { name: 'matthew', isSelected: false, v: 'v2' },
      { name: 'molly', isSelected: false, v: 'v2' },
      { name: 'patrick', isSelected: false, v: 'v2' },
      { name: 'rachel', isSelected: false, v: 'v2' }
    ]
  )

  const handleImageClick = index => {
    setPlaceholderNames(prevState => {
      const newNames = prevState.map((item, i) => {
        if (i === index) {
          item.isSelected = true;
          setProfilePicture(item.name);
        } else {
          item.isSelected = false;
        }
        return item;
      });
      return newNames;
    });
  };

  const { onChange, onSubmit, values } = useForm(registerUser, initialState);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      navigate('/', { replace: true });
    },
    onError(err) {
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
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />
        <Form.Input
          label='E-mail'
          placeholder='E-mail'
          name='email'
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
        />
        <Form.Input
          type='password'
          label='Password'
          placeholder='Password'
          name='password'
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />
        <Form.Input
          type='password'
          label='Confirm Password'
          placeholder='Confirm Password'
          name='confirmPassword'
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
        />

        <Form.Input
          name='profilePicture'
          value={values.profilePicture}
          onChange={onChange}
          style={{ display: 'none' }}
        />
      </Form>
      <div style={{ margin: '2rem 0' }}>
        <Grid
          style={{
            marginTop: '2rem',
            borderRadius: '.28571429rem',

            // boxShadow: '0 1px 3px 0 #d4d4d5,0 0 0 1px #d4d4d5',
            width: '80vw',
          }}
          stackable
          relaxed
        >
          <Grid.Row>
            <h2
              style={{
                marginBottom: '2em',
                marginTop: '1em',
                width: '100%',

                textAlign: 'center',
              }}
            >
              Select an Avatar
            </h2>
          </Grid.Row>
          <Grid.Row>
            {placeholderNames.map((item, index) => {
              return (
                <GridColumn
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: 'auto auto',
                    marginBottom: '1.5rem',
                  }}
                  key={item.name}
                  computer={2}
                  tablet={3}
                  mobile={4}
                >
                  <Image
                    src={
                      item.v === 'v1'
                        ? `https://semantic-ui.com/images/avatar/large/${item.name}.jpg`
                        : `https://semantic-ui.com/images/avatar2/large/${item.name}.png`
                    }
                    circular
                    onClick={(e: React.SyntheticEvent) => {
                      e.preventDefault();
                      handleImageClick(index);
                    }}
                    style={{
                      boxShadow: item.isSelected
                        ? '0 1px 3px 0 #9627ba,0 0 0 2px #9627ba'
                        : '',
                    }}
                  />
                  <h4
                    key={item.name}
                    style={{
                      textTransform: 'capitalize',
                      fontWeight: item.isSelected ? 'bold' : '200',
                      marginTop: '.5rem',
                    }}
                  >
                    {item.name}
                  </h4>
                </GridColumn>
              );
            })}
          </Grid.Row>
          <Grid.Row
            style={{
              display: 'grid',
              justifyContent: 'center',
              margin: '1rem 0',
            }}
          >
            <Button
              type='submit'
              color='purple'
              size='big'
            >
              Register
            </Button>
          </Grid.Row>
        </Grid>
      </div>

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
