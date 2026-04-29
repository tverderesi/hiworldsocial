import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Button, Form, Message } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

import { RESET_PASSWORD } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";
import { useForm } from "../util/hooks";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState({}) as any;
  const [successMessage, setSuccessMessage] = useState("");
  const token = searchParams.get("token") ?? "";
  const { onChange, onSubmit, values } = useForm(onResetPassword, {
    password: "",
    confirmPassword: "",
  });

  const [resetPassword, { loading }] = useMutation<any>(RESET_PASSWORD, {
    update(_, { data }) {
      setErrors({});
      setSuccessMessage(data.resetPassword.message);
    },
    onError(err: any) {
      setSuccessMessage("");
      setErrors(getGraphQLErrors(err));
    },
    variables: {
      token,
      ...values,
    },
  });

  function onResetPassword() {
    if (!token) {
      setSuccessMessage("");
      setErrors({ token: t("resetPassword.invalidToken") });
      return;
    }

    resetPassword();
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
        style={{ marginBottom: "1em", marginTop: "1em" }}
      >
        {t("resetPassword.title")}
      </h1>
      <Form
        onSubmit={onSubmit}
        noValidate
        style={{ width: "50%" }}
        className={loading ? "loading" : ""}
      >
        <Form.Input
          type="password"
          label={t("profileForm.newPassword")}
          placeholder={t("profileForm.newPassword")}
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
        <Button type="submit" primary>
          {t("actions.resetPassword")}
        </Button>
      </Form>
      {successMessage && (
        <Message positive style={{ marginTop: "1.5em", maxWidth: 480 }}>
          <Message.Header>{t("resetPassword.passwordUpdated")}</Message.Header>
          <p>{successMessage}</p>
          <p>
            <Link to="/login">{t("actions.goToLogin")}</Link>
          </p>
        </Message>
      )}
      {errors && Object.keys(errors).length > 0 && (
        <div className="ui error message" style={{ marginTop: "1.5em" }}>
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
