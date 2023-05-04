import { Form, Grid, Button } from "semantic-ui-react";
import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";
import { REGISTER_USER } from "../util/GraphQL";
import { profilePictureDictionary } from "../util/profilePictureDictionary";
import { ProfilePictureSelector } from "./ProfilePictureSelector";

function Register() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({}) as any;

  const initialState: any = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: "ade",
  };

  //prettier-ignore
  const [placeholderNames, setPlaceholderNames] = useState(
  profilePictureDictionary
  )

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

  const { onChange, onSubmit, values } = useForm(registerUser, initialState);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      console.log(userData);
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1
        className="page-title"
        style={{ marginBottom: "2em", marginTop: "1em" }}
      >
        Register
      </h1>
      {Object.keys(errors)?.length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value: any) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
      <Form
        onSubmit={onSubmit}
        noValidate
        style={{
          width: "80vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className={loading ? "loading" : ""}
      >
        <div>
          <Form.Input
            label="Username"
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={onChange}
            error={errors?.username ? true : false}
          />
          <Form.Input
            label="E-mail"
            placeholder="E-mail"
            name="email"
            value={values.email}
            onChange={onChange}
            error={errors?.email ? true : false}
          />
          <Form.Input
            type="password"
            label="Password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={onChange}
            error={errors?.password ? true : false}
          />
          <Form.Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={onChange}
            error={errors?.confirmPassword ? true : false}
          />
          <Form.Input
            style={{ display: "none" }}
            value={values.profilePicture}
            onChange={onChange}
          />
        </div>

        <ProfilePictureSelector
          handleImageClick={handleImageClick}
          placeholderNames={placeholderNames}
        />
        <Grid.Row
          style={{
            display: "grid",
            justifyContent: "center",
            margin: "1rem 0",
          }}
        >
          <Button type="submit" color="purple" size="big">
            Register
          </Button>
        </Grid.Row>
      </Form>
    </div>
  );
}

export default Register;
