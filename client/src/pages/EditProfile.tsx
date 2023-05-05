import { useState, useContext } from "react";
import { Form, Button, Container, Grid } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_QUERY, UPDATE_USER_MUTATION } from "../util/GraphQL";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { ProfilePictureSelector } from "../atoms/ProfilePictureSelector";

export function EditProfile() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({}) as any;

  const { user } = useContext(AuthContext) as any;

  const { loading, error, data } = useQuery(GET_USER_QUERY, {
    variables: { username: user?.username },
  });

  const initialState: any = {
    username: data?.getUser?.username || "",
    email: data?.getUser?.email || "",
    password: data?.getUser?.password || "",
    newPassword: "",
    confirmPassword: "",
    profilePicture: data?.getUser?.profilePicture || "",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to backend API
  };
  const { onChange, onSubmit, values } = useForm(updateUser, initialState);

  const [changeUser, { loading: updating }] = useMutation(
    UPDATE_USER_MUTATION,
    {
      update(_, { data: { updateUser: userData } }) {
        navigate("/", { replace: true });
      },
      onError(err) {
        setErrors(err.graphQLErrors[0].extensions.errors);
      },
      variables: values,
    }
  );

  function updateUser() {
    changeUser();
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
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
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Username</label>
          <input
            placeholder="Username"
            value={values.username}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <input placeholder="email" value={values.email} onChange={onChange} />
        </Form.Field>
        <Form.Field>
          <label>Old Password</label>
          <input
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>New Password</label>
          <input
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
          <Button type="submit" color="purple" size="big">
            Save Changes
          </Button>
        </Grid.Row>
      </Form>
    </Container>
  );
}

export default EditProfile;
