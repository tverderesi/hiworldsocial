import { Button, Form } from "semantic-ui-react";
import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";
import { LOGIN_USER } from "../util/GraphQL";

export default function Login() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({}) as any;

  const initialState = { username: "", password: "" };

  const { onChange, onSubmit, values } = useForm(
    loginUserCallback,
    initialState
  );

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      navigate("/", { replace: true });
    },
    onError(err: any) {
      setErrors(err.graphQLErrors[0]?.extensions?.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
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
        Login
      </h1>
      <Form
        onSubmit={onSubmit}
        noValidate
        style={{ width: "50%" }}
        className={loading ? "loading" : ""}
      >
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors?.username ? true : false}
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

        <Button type="submit" primary>
          login
        </Button>
      </Form>
      {errors && Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value: any) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
