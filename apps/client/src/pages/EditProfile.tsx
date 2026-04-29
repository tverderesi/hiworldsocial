import { useState, useContext, type ChangeEvent } from "react";
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/client/react";
import { UPDATE_USER_MUTATION } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/auth";
import { ProfilePictureSelector } from "../atoms/ProfilePictureSelector";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { setPreferredLanguage, type SupportedLanguage } from "../i18n";

export function EditProfile() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const context = useContext(AuthContext) as any;
  const user = context.user;
  const initialState: any = { oldUsername: user.username, newUsername: "", email: user.email, oldPassword: "", newPassword: "", confirmPassword: "", profilePicture: user.profilePicture, preferredLanguage: user.preferredLanguage ?? i18n.language };
  const { onChange, onSubmit, values } = useForm(updateUser, initialState);
  const [errors, setErrors] = useState({}) as any;
  const [changeUser, { loading }] = useMutation<any>(UPDATE_USER_MUTATION, {
    update(_, { data: { updateUser: userData } }) { context.login(userData); navigate("/", { replace: true }); },
    onError(err) { setErrors(getGraphQLErrors(err)); },
    variables: { updateProfileInput: values },
  });
  function updateUser() { changeUser(); }
  function onLanguageChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange(e);
    setPreferredLanguage(e.target.value as SupportedLanguage);
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>{t("common.loading")}</p>;

  return (
    <div className="page-shell" style={{ maxWidth: 600 }}>
      <h1>{t("profileForm.title")}</h1>
      {Object.keys(errors)?.length > 0 && <div className="error-message"><ul>{Object.values(errors).map((value: any) => <li key={value}>{value}</li>)}</ul></div>}
      <form onSubmit={onSubmit}>
        <div className="form-field"><label className="form-label">{t("profileForm.newUsername")}</label><Input name="newUsername" placeholder={t("common.username")} value={values.newUsername} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">{t("common.email")}</label><Input placeholder={t("common.email")} name="email" value={values.email} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">{t("profileForm.oldPassword")}</label><Input name="oldPassword" type="password" placeholder={t("common.password")} value={values.oldPassword} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">{t("profileForm.newPassword")}</label><Input name="newPassword" type="password" placeholder={t("profileForm.newPassword")} value={values.newPassword} onChange={onChange} /></div>
        <div className="form-field"><label className="form-label">{t("profileForm.confirmNewPassword")}</label><Input type="password" placeholder={t("profileForm.confirmNewPassword")} name="confirmPassword" value={values.confirmPassword} onChange={onChange} /></div>
        <div className="form-field">
          <label className="form-label">{t("languages.label")}</label>
          <select className="input-base" name="preferredLanguage" value={values.preferredLanguage} onChange={onLanguageChange}>
            <option value="en">{t("languages.en")}</option>
            <option value="pt">{t("languages.pt")}</option>
          </select>
        </div>
        <ProfilePictureSelector values={values} update />
        <div style={{ display: "grid", justifyContent: "center", margin: "1rem 0" }}><Button type="submit">{t("actions.saveChanges")}</Button></div>
      </form>
    </div>
  );
}
