import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { RESET_PASSWORD } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";
import { useForm } from "../util/hooks";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert } from "../components/ui/alert";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState({}) as any;
  const [successMessage, setSuccessMessage] = useState("");
  const token = searchParams.get("token") ?? "";
  const { onChange, onSubmit, values } = useForm(onResetPassword, { password: "", confirmPassword: "" });

  const [resetPassword, { loading }] = useMutation<any>(RESET_PASSWORD, {
    update(_, { data }) { setErrors({}); setSuccessMessage(data.resetPassword.message); },
    onError(err: any) { setSuccessMessage(""); setErrors(getGraphQLErrors(err)); },
    variables: { token, ...values },
  });

  function onResetPassword() { if (!token) { setSuccessMessage(""); setErrors({ token: "Reset link is invalid or expired." }); return; } resetPassword(); }

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <h1 className="page-title" style={{ marginBottom: "1em", marginTop: "1em" }}>Reset Password</h1>
      <form onSubmit={onSubmit} noValidate style={{ width: "50%" }}>
        <div className="form-field"><label className="form-label">New Password</label><Input type="password" placeholder="New Password" name="password" value={values.password} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">Confirm Password</label><Input type="password" placeholder="Confirm Password" name="confirmPassword" value={values.confirmPassword} onChange={onChange} /></div>
        <Button type="submit" disabled={loading}>Reset Password</Button>
      </form>
      {successMessage && <Alert className="alert-success" style={{ marginTop: "1.5em", maxWidth: 480 }}><strong>Password updated</strong><p>{successMessage}</p><p><Link to="/login">Go to login</Link></p></Alert>}
      {errors && Object.keys(errors).length > 0 && <div className="error-message" style={{ marginTop: "1.5em" }}><ul>{Object.values(errors).map((value: any) => <li key={value}>{value}</li>)}</ul></div>}
    </div>
  );
}
