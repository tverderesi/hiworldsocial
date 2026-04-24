import { useState, useContext } from "react";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { LOGOUT_USER, ME_QUERY } from "../util/GraphQL";
import { getPictureURL } from "../util/profilePictureDictionary";
import { useDisplayProfile } from "../util/hooks";
import Profile from "../pages/User";

export default function MenuBar() {
  const client = useApolloClient();
  const { user, logout }: { user: any; logout: any } = useContext(AuthContext);
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

  return (
    <nav className="menu page-shell">
      {showProfile && <Profile setProfileState={setShowProfile} username={user?.username} />}
      <div className="menu-group">
        <Link to="/" className="menu-item logo">Hi World! 🌎</Link>
      </div>
      <div className="menu-group">
        {user ? (
          <>
            <button className="menu-item btn-ghost" onClick={onClick}>
              <img src={getPictureURL(user.profilePicture)} className="avatar avatar-sm" style={{ marginRight: ".5rem" }} />
              {user.username}
            </button>
            <Link className="menu-item" to="/login" onClick={() => void logoutUser()}>logout</Link>
          </>
        ) : (
          <>
            <Link className={`menu-item ${activeItem === "login" ? "active" : ""}`} to="/login" onClick={() => setActiveItem("login")}>login</Link>
            <Link className={`menu-item ${activeItem === "register" ? "active" : ""}`} to="/register" onClick={() => setActiveItem("register")}>register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
