import { useState, useContext } from "react";
import { Form, Button, Container } from "semantic-ui-react";
import { profilePictureDictionary } from "../util/profilePictureDictionary";
import { ProfilePictureSelector } from "./ProfilePictureSelector";
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../util/GraphQL";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";

export function EditProfile() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({}) as any;
  const context = useContext(AuthContext);
  const initialState: any = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: "ade",
  };
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to backend API
  };
  const [placeholderNames, setPlaceholderNames] = useState(
    profilePictureDictionary
  );

  const { onChange, onSubmit, values } = useForm(registerUser, initialState);
  const handleImageClick = (index) => {
    setPlaceholderNames((prevState) => {
      const newNames = prevState.map((item, i) => {
        if (i === index) {
          item.isSelected = true;

          values.profilePicture = item.name;
        } else {
          item.isSelected = false;
        }
        return item;
      });
      return newNames;
    });
  };
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);

      navigate("/", { replace: true });
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: {
      registerInput: values,
    },
  });
  function registerUser() {
    addUser();
  }
  return (
    <Container>
      <h1>Edit Profile</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Username</label>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Field>
        <ProfilePictureSelector
          handleImageClick={handleImageClick}
          placeholderNames={placeholderNames}
        />
        <Button type="submit" primary>
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}

export default EditProfile;
