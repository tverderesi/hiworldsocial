import { useState, useContext, type ChangeEvent } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Image, Menu, MenuItemProps } from "semantic-ui-react";
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

  const pathname = window.location.pathname;

  const path = pathname === "/" ? "home" : pathname.substring(1);

  const [state, setState] = useState({ activeItem: path });
  const { activeItem } = state;

  const { onClick, setShowProfile, showProfile } = useDisplayProfile(false);
  const [logoutUser] = useMutation(LOGOUT_USER, {
    onCompleted: async () => {
      logout();
      await client.clearStore();
      client.writeQuery({
        query: ME_QUERY,
        data: { me: null },
      });
    },
    onError: () => {
      logout();
    },
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

  const handleItemClick = (
    e: React.SyntheticEvent<any, any>,
    { name }: MenuItemProps
  ) => (name ? setState({ activeItem: name }) : "");

  return user ? (
    <Menu pointing secondary size="massive" color="purple" stackable>
      {showProfile && (
        <Profile setProfileState={setShowProfile} username={user.username} />
      )}
      <Menu.Item style={{ height: "7vh" }}>
        <Link to={"/"} className="logo" style={{ fontWeight: "bold" }}>
          Hi World! 🌎
        </Link>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span>{t("languages.label")}</span>
            <select aria-label={t("languages.label")} value={i18n.language.startsWith("pt") ? "pt" : "en"} onChange={onLanguageChange}>
              <option value="en">{t("languages.en")}</option>
              <option value="pt">{t("languages.pt")}</option>
            </select>
          </label>
        </Menu.Item>
        <Menu.Item
          onClick={onClick}
          style={{
            height: "7vh",
            fontWeight: "bold",
            color: "rgb(150, 39, 186)",
          }}
          name={user?.username}
          children={
            <>
              <Image
                src={getPictureURL(user.profilePicture)}
                avatar
                inline
                style={{ marginRight: ".5rem", height: "30px", width: "auto" }}
              />
              {user?.username}
            </>
          }
        />
        <Menu.Item
          name={t("actions.logout")}
          onClick={() => {
            void logoutUser();
          }}
          as={Link}
          to="/login"
          style={{
            fontWeight: "bold",
            height: "7vh",
          }}
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary stackable size="massive" color="purple">
      <Menu.Item
        as={Link}
        to={"/"}
        className="logo"
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        style={{
          height: "7vh",
          fontWeight: "bold",
        }}
      >
        Hi World! 🌎
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item>
          <label style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span>{t("languages.label")}</span>
            <select aria-label={t("languages.label")} value={i18n.language.startsWith("pt") ? "pt" : "en"} onChange={onLanguageChange}>
              <option value="en">{t("languages.en")}</option>
              <option value="pt">{t("languages.pt")}</option>
            </select>
          </label>
        </Menu.Item>
        <Menu.Item
          name="login"
          content={t("actions.login")}
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
          style={{ fontWeight: "bold", height: "7vh" }}
        />
        <Menu.Item
          name="register"
          content={t("actions.register")}
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
          style={{ fontWeight: "bold", height: "7vh" }}
        />
      </Menu.Menu>
    </Menu>
  );
}
