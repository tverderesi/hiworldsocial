import { useState, useContext, type ChangeEvent } from "react";
import { Form, Button, Container, Grid, Loader } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/client/react";
import { UPDATE_USER_MUTATION } from "../util/GraphQL";
import { getGraphQLErrors } from "../util/errors";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { ProfilePictureSelector } from "../atoms/ProfilePictureSelector";
import { setPreferredLanguage, type SupportedLanguage } from "../i18n";

export function EditProfile() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const context = useContext(AuthContext) as any;
  const user = context.user;

  const initialState: any = {
    oldUsername: user.username,
    newUsername: "",
    email: user.email,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePicture: user.profilePicture,
    preferredLanguage: user.preferredLanguage ?? i18n.language,
  };

  const { onChange, onSubmit, values } = useForm(updateUser, initialState);

  const [errors, setErrors] = useState({}) as any;

  const [changeUser, { loading }] = useMutation<any>(UPDATE_USER_MUTATION, {
    update(_, { data: { updateUser: userData } }) {
      context.login(userData);

      navigate("/", { replace: true });
    },
    onError(err) {
      setErrors(getGraphQLErrors(err));
    },
    variables: { updateProfileInput: values },
  });

  function updateUser() {
    changeUser();
  }

  function onLanguageChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange(e);
    setPreferredLanguage(e.target.value as SupportedLanguage);
  }

  return loading ? (
    <Loader active />
  ) : (
    <Container>
      <h1>{t("profileForm.title")}</h1>
      {Object.keys(errors)?.length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value: any) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>{t("profileForm.newUsername")}</label>
          <input
            name="newUsername"
            placeholder={t("common.username")}
            value={values.newUsername}
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field>
          <label>{t("common.email")}</label>
          <input
            placeholder={t("common.email")}
            name="email"
            value={values.email}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>{t("profileForm.oldPassword")}</label>
          <input
            name="oldPassword"
            type="password"
            placeholder={t("common.password")}
            value={values.oldPassword}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>{t("profileForm.newPassword")}</label>
          <input
            name="newPassword"
            type="password"
            placeholder={t("profileForm.newPassword")}
            value={values.newPassword}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>{t("profileForm.confirmNewPassword")}</label>
          <input
            type="password"
            placeholder={t("profileForm.confirmNewPassword")}
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <label>{t("languages.label")}</label>
          <select name="preferredLanguage" value={values.preferredLanguage} onChange={onLanguageChange}>
            <option value="en">{t("languages.en")}</option>
            <option value="pt">{t("languages.pt")}</option>
          </select>
        </Form.Field>
        <ProfilePictureSelector values={values} update />
        <Grid.Row
          style={{
            display: "grid",
            justifyContent: "center",
            margin: "1rem 0",
          }}
        >
          <Button type="submit" color="purple" size="big" onSubmit={onSubmit}>
            {t("actions.saveChanges")}
          </Button>
        </Grid.Row>
      </Form>
    </Container>
  );
}
