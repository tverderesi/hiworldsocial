import { useContext } from "react";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { GET_USER_QUERY } from "../util/GraphQL";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import moment from "moment";
import { getPictureURL } from "../util/profilePictureDictionary";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";

export default function Profile({ username, setProfileState }) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext) as any;
  const { loading, error, data } = useQuery<any>(GET_USER_QUERY, { variables: { username } });
  if (loading) return <p>{t("common.loading")}</p>;
  if (error) return <p>{t("common.error", { message: error.message })}</p>;

  const { createdAt, profilePicture } = data.getUser;
  const isAuthUser = user?.username === username;

  return (
    <div style={{ position: "fixed", zIndex: "50", width: "100vw", height: "100vh", left: "0", top: "0", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.1)", backdropFilter: "blur(5px)" }}>
      <Card style={{ width: "min(420px, 92vw)", position: "relative" }}>
        <button onClick={(e) => { e.preventDefault(); setProfileState(false); }} style={{ position: "absolute", width: "30px", height: "30px", top: "5px", right: "5px", zIndex: "100", borderRadius: "999px", border: "1px solid rgba(34,36,38,.15)" }}>✕</button>
        <img src={getPictureURL(profilePicture)} alt="profile" style={{ width: "100%" }} />
        <CardContent>
          <h3>{username}</h3>
          <span>{t("profile.joined", { time: moment(createdAt).fromNow() })}</span>
        </CardContent>
        {isAuthUser && <CardFooter><Button onClick={() => setProfileState(false)}><Link to="/profile/editprofile" style={{ color: "white" }}>{t("actions.editProfile")}</Link></Button></CardFooter>}
      </Card>
    </div>
  );
}
