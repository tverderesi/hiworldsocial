import { useState, useContext } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";
import { REGISTER_USER } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";
import { ProfilePictureSelector } from "../atoms/ProfilePictureSelector";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

function Register() {
  const { t } = useTranslation();
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({}) as any;
  const initialState: any = { username: "", email: "", password: "", confirmPassword: "", profilePicture: "ade" };
  const { onChange, onSubmit, values } = useForm(registerUser, initialState);

  const [addUser, { loading }] = useMutation<any>(REGISTER_USER, {
    update(_, { data: { register: userData } }) { context.login(userData); navigate("/", { replace: true }); },
    onError(err) { setErrors(getGraphQLErrors(err)); },
    variables: { registerInput: values },
  });

  function registerUser() { addUser(); }

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <h1 className="page-title" style={{ marginBottom: "2em", marginTop: "1em" }}>{t("register.title")}</h1>
      {Object.keys(errors)?.length > 0 && <div className="error-message"><ul>{Object.values(errors).map((value: any) => <li key={value}>{value}</li>)}</ul></div>}
      <form onSubmit={onSubmit} noValidate style={{ width: "80vw", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "min(420px, 90%)" }}>
          <div className="form-field"><label className="form-label">{t("common.username")}</label><Input placeholder={t("common.username")} name="username" value={values.username} onChange={onChange} /></div>
          <div className="form-field"><label className="form-label">{t("common.email")}</label><Input placeholder={t("common.email")} name="email" value={values.email} onChange={onChange} /></div>
          <div className="form-field"><label className="form-label">{t("common.password")}</label><Input type="password" placeholder={t("common.password")} name="password" value={values.password} onChange={onChange} /></div>
          <div className="form-field"><label className="form-label">{t("register.confirmPassword")}</label><Input type="password" placeholder={t("register.confirmPassword")} name="confirmPassword" value={values.confirmPassword} onChange={onChange} /></div>
        </div>
        <ProfilePictureSelector values={values} />
        <div style={{ margin: "1rem 0" }}><Button type="submit" disabled={loading}>{t("register.title")}</Button></div>
      </form>
    </div>
  );
}

export default Register;
