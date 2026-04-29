import { Form, Grid, Button } from "semantic-ui-react";
import { useState, useContext } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";
import { REGISTER_USER } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";

import { ProfilePictureSelector } from "../atoms/ProfilePictureSelector";

function Register() {
  const { t } = useTranslation();
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

  const { onChange, onSubmit, values } = useForm(registerUser, initialState);

  const [addUser, { loading }] = useMutation<any>(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);

      navigate("/", { replace: true });
    },
    onError(err) {
      setErrors(getGraphQLErrors(err));
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
        {t("register.title")}
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
            label={t("common.username")}
            placeholder={t("common.username")}
            name="username"
            value={values.username}
            onChange={onChange}
            error={errors?.username ? true : false}
          />
          <Form.Input
            label={t("common.email")}
            placeholder={t("common.email")}
            name="email"
            value={values.email}
            onChange={onChange}
            error={errors?.email ? true : false}
          />
          <Form.Input
            type="password"
            label={t("common.password")}
            placeholder={t("common.password")}
            name="password"
            value={values.password}
            onChange={onChange}
            error={errors?.password ? true : false}
          />
          <Form.Input
            type="password"
            label={t("register.confirmPassword")}
            placeholder={t("register.confirmPassword")}
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={onChange}
            error={errors?.confirmPassword ? true : false}
          />
        </div>

        <ProfilePictureSelector values={values} />
        <Grid.Row
          style={{
            display: "grid",
            justifyContent: "center",
            margin: "1rem 0",
          }}
        >
          <Button type="submit" color="purple" size="big">
            {t("register.title")}
          </Button>
        </Grid.Row>
      </Form>
    </div>
  );
}

export default Register;
