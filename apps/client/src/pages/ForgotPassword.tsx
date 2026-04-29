import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { REQUEST_PASSWORD_RESET } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";
import { useForm } from "../util/hooks";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert } from "../components/ui/alert";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({}) as any;
  const [successMessage, setSuccessMessage] = useState("");
  const { onChange, onSubmit, values } = useForm(onRequestReset, { email: "" });
  const [requestPasswordReset, { loading }] = useMutation<any>(REQUEST_PASSWORD_RESET, {
    update(_, { data }) { setErrors({}); setSuccessMessage(data.requestPasswordReset.message); },
    onError(err: any) { setSuccessMessage(""); setErrors(getGraphQLErrors(err)); },
    variables: values,
  });
  function onRequestReset() { requestPasswordReset(); }

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <h1 className="page-title" style={{ marginBottom: "1em", marginTop: "1em" }}>{t("forgotPassword.title")}</h1>
      <p style={{ maxWidth: 480, textAlign: "center", marginBottom: "1.5em" }}>{t("forgotPassword.description")}</p>
      <form onSubmit={onSubmit} noValidate style={{ width: "50%" }}>
        <div className="form-field"><label className="form-label">{t("common.email")}</label><Input placeholder={t("common.email")} name="email" value={values.email} onChange={onChange} /></div>
        <Button type="submit" disabled={loading}>{t("actions.sendResetLink")}</Button>
      </form>
      {successMessage && <Alert className="alert-success" style={{ marginTop: "1.5em", maxWidth: 480 }}><strong>{t("forgotPassword.checkEmail")}</strong><p>{successMessage}</p></Alert>}
      {errors && Object.keys(errors).length > 0 && <div className="error-message" style={{ marginTop: "1.5em" }}><ul>{Object.values(errors).map((value: any) => <li key={value}>{value}</li>)}</ul></div>}
      <p style={{ marginTop: "1.5em" }}><Link to="/login">{t("actions.backToLogin")}</Link></p>
    </div>
  );
}
