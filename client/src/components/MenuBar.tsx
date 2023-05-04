import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { Image, Menu, MenuItemProps } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { getPictureURL } from "../util/profilePictureDictionary";

export default function MenuBar() {
  const { user, logout }: { user: any; logout: any } = useContext(AuthContext);

  const pathname = window.location.pathname;

  const path = "/" ? "home" : pathname.substring(1);

  const [state, setState] = useState({ activeItem: path });
  const { activeItem } = state;

  const handleItemClick = (
    e: React.SyntheticEvent<any, any>,
    { name }: MenuItemProps
  ) => (name ? setState({ activeItem: name }) : "");

  return user ? (
    <Menu
      pointing
      secondary
      size="massive"
      color="purple"
      style={{
        display: "flex",
        justifyItems: "center",
        width: "100vw !important",
        height: "7vh !important",
      }}
    >
      <Menu.Item
        style={{ height: "100%", width: "33.333333%" }}
        name={user?.username}
        active
        onClick={handleItemClick}
        as={Link}
        to="/profile"
        children={
          <>
            <Image
              src={getPictureURL(user.profilePicture)}
              avatar
              inline
              style={{ marginRight: ".5rem" }}
            />
            {user?.username}
          </>
        }
      />

      <Menu.Item
        style={{
          height: "7vh",
          width: "33.333333%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link to={"/"} className="logo" style={{ fontWeight: "bold" }}>
          Hi World! 🌎
        </Link>
      </Menu.Item>

      <Menu.Item
        name="logout"
        onClick={logout}
        as={Link}
        to="/login"
        style={{
          fontWeight: "bold",
          height: "7vh",
          width: "33.333333%",
          display: "flex",
          justifyContent: "end",
        }}
      />
    </Menu>
  ) : (
    <Menu
      pointing
      secondary
      size="massive"
      color="purple"
      style={{
        display: "flex",
        justifyItems: "center",
        width: "100vw !important",
        height: "100vh !important",
      }}
    >
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
        style={{ height: "7vh", width: "33.3333333333%" }}
      />
      <Menu.Item
        style={{
          height: "7vh",
          width: "33.333333%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link to={"/"} className="logo" style={{ fontWeight: "bold" }}>
          Hi World! 🌎
        </Link>
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
          style={{ fontWeight: "bold", height: "7vh" }}
        />
        <Menu.Item
          name="register"
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
