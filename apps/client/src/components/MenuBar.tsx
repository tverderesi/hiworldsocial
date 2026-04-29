import { useState, useContext, type ChangeEvent } from "react";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/auth";
import { LOGOUT_USER, ME_QUERY, UPDATE_PREFERRED_LANGUAGE } from "../util/GraphQL";
import { getPictureURL } from "../util/profilePictureDictionary";
import { useDisplayProfile } from "../util/hooks";
import Profile from "../pages/User";
import { setPreferredLanguage, type SupportedLanguage } from "../i18n";

export default function MenuBar() {
  const { i18n, t } = useTranslation();
  const client = useApolloClient();
  const { user, login, logout }: { user: any; login: any; logout: any } = useContext(AuthContext);
  const path = window.location.pathname === "/" ? "home" : window.location.pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);
  const { onClick, setShowProfile, showProfile } = useDisplayProfile(false);

  const [logoutUser] = useMutation(LOGOUT_USER, {
    onCompleted: async () => {
      logout();
      await client.clearStore();
      client.writeQuery({ query: ME_QUERY, data: { me: null } });
    },
    onError: logout,
  });
  const [updatePreferredLanguage] = useMutation<any>(UPDATE_PREFERRED_LANGUAGE, {
    onCompleted: ({ updatePreferredLanguage: userData }) => login(userData),
  });

  function onLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
    const preferredLanguage = event.target.value as SupportedLanguage;
    setPreferredLanguage(preferredLanguage);
    if (user) {
      void updatePreferredLanguage({ variables: { preferredLanguage } });
    }
  }

  const languageSelect = (
    <label className="menu-item" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
      <span>{t("languages.label")}</span>
      <select
        aria-label={t("languages.label")}
        onChange={onLanguageChange}
        value={i18n.language.startsWith("pt") ? "pt" : "en"}
      >
        <option value="en">{t("languages.en")}</option>
        <option value="pt">{t("languages.pt")}</option>
      </select>
    </label>
  );

  return (
    <nav className="menu page-shell">
      {showProfile && <Profile setProfileState={setShowProfile} username={user?.username} />}
      <div className="menu-group">
        <Link to="/" className="menu-item logo">Hi World! 🌎</Link>
      </div>
      <div className="menu-group">
        {user ? (
          <>
            {languageSelect}
            <button className="menu-item btn-ghost" onClick={onClick}>
              <img src={getPictureURL(user.profilePicture)} className="avatar avatar-sm" style={{ marginRight: ".5rem" }} />
              {user.username}
            </button>
            <Link className="menu-item" to="/login" onClick={() => void logoutUser()}>{t("actions.logout")}</Link>
          </>
        ) : (
          <>
            {languageSelect}
            <Link className={`menu-item ${activeItem === "login" ? "active" : ""}`} to="/login" onClick={() => setActiveItem("login")}>{t("actions.login")}</Link>
            <Link className={`menu-item ${activeItem === "register" ? "active" : ""}`} to="/register" onClick={() => setActiveItem("register")}>{t("actions.register")}</Link>
          </>
        )}
      </div>
    </nav>
  );
}
