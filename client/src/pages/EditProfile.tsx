import { useState, useContext } from "react";
import { Form, Button, Container, Grid, Loader } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "../util/GraphQL";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { ProfilePictureSelector } from "../atoms/ProfilePictureSelector";

export function EditProfile() {
  const navigate = useNavigate();
  const context = useContext(AuthContext) as any;
  const user = context.user;

  const initialState: any = {
    oldUsername: user.username,
    newUsername: "",
    email: user.email,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePicture: user.profilePicture,
  };

  const { onChange, onSubmit, values } = useForm(updateUser, initialState);

  const [errors, setErrors] = useState({}) as any;

  const [changeUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    update(_, { data: { updateUser: userData } }) {
      context.logout();
      context.login(userData);

      navigate("/", { replace: true });
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions?.errors);
    },
    variables: { updateProfileInput: values },
  });

  function updateUser() {
    changeUser();
  }

  return loading ? (
    <Loader active />
  ) : (
    <Container>
      <h1>Edit Profile</h1>
      {Object.keys(errors)?.length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value: any) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>
            New Username (Leave Blank if you don't want to change it)
          </label>
          <input
            name="newUsername"
            placeholder="Username"
            value={values.newUsername}
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field>
          <label>Email</label>
          <input
            placeholder="email"
            name="email"
            value={values.email}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Old Password</label>
          <input
            name="oldPassword"
            type="password"
            placeholder="Password"
            value={values.oldPassword}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>New Password</label>
          <input
            name="newPassword"
            type="password"
            placeholder="Password"
            value={values.newPassword}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={onChange}
          />
        </Form.Field>
        <ProfilePictureSelector values={values} update />
        <Grid.Row
          style={{
            display: "grid",
            justifyContent: "center",
            margin: "1rem 0",
          }}
        >
          <Button type="submit" color="purple" size="big" onSubmit={onSubmit}>
            Save Changes
          </Button>
        </Grid.Row>
      </Form>
    </Container>
  );
}
