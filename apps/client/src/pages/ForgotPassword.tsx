import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Button, Form, Message } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

import { REQUEST_PASSWORD_RESET } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";
import { useForm } from "../util/hooks";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({}) as any;
  const [successMessage, setSuccessMessage] = useState("");
  const { onChange, onSubmit, values } = useForm(onRequestReset, { email: "" });

  const [requestPasswordReset, { loading }] = useMutation<any>(
    REQUEST_PASSWORD_RESET,
    {
      update(_, { data }) {
        setErrors({});
        setSuccessMessage(data.requestPasswordReset.message);
      },
      onError(err: any) {
        setSuccessMessage("");
        setErrors(getGraphQLErrors(err));
      },
      variables: values,
    }
  );

  function onRequestReset() {
    requestPasswordReset();
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
        {t("forgotPassword.title")}
      </h1>
      <p style={{ maxWidth: 480, textAlign: "center", marginBottom: "1.5em" }}>
        {t("forgotPassword.description")}
      </p>
      <Form
        onSubmit={onSubmit}
        noValidate
        style={{ width: "50%" }}
        className={loading ? "loading" : ""}
      >
        <Form.Input
          label={t("common.email")}
          placeholder={t("common.email")}
          name="email"
          value={values.email}
          onChange={onChange}
          error={errors?.email ? true : false}
        />
        <Button type="submit" primary>
          {t("actions.sendResetLink")}
        </Button>
      </Form>
      {successMessage && (
        <Message positive style={{ marginTop: "1.5em", maxWidth: 480 }}>
          <Message.Header>{t("forgotPassword.checkEmail")}</Message.Header>
          <p>{successMessage}</p>
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
      <p style={{ marginTop: "1.5em" }}>
        <Link to="/login">{t("actions.backToLogin")}</Link>
      </p>
    </div>
  );
}
