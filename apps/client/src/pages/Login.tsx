import { Button, Form } from "semantic-ui-react";
import { useState, useContext } from "react";
import { useMutation } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";
import { LOGIN_USER } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";

export default function Login() {
  const { t } = useTranslation();
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({}) as any;

  const initialState = { username: "", password: "" };

  const { onChange, onSubmit, values } = useForm(
    loginUserCallback,
    initialState
  );

  const [loginUser, { loading }] = useMutation<any>(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      navigate("/", { replace: true });
    },
    onError(err: any) {
      setErrors(getGraphQLErrors(err));
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
        {t("actions.login")}
      </h1>
      <Form
        onSubmit={onSubmit}
        noValidate
        style={{ width: "50%" }}
        className={loading ? "loading" : ""}
      >
        <Form.Input
          label={t("common.username")}
          placeholder={t("common.username")}
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors?.username ? true : false}
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

        <Button type="submit" primary>
          {t("actions.login")}
        </Button>
      </Form>
      <p style={{ marginTop: "1em" }}>
        <Link to="/forgot-password">{t("forgotPassword.title")}</Link>
      </p>
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
