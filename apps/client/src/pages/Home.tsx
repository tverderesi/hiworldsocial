import { useQuery } from "@apollo/client/react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import Ad from "../components/Ad";
import NewPost from "../components/NewPost";
import Post from "../components/Post";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/GraphQL";
import { Outlet } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";

function Home() {
  const { t } = useTranslation();
  const { loading, data } = useQuery<any>(FETCH_POSTS_QUERY);
  const posts = data?.getPosts;
  const { user } = useContext(AuthContext);

  return (
    <div className="page-shell" style={{ marginTop: "1rem" }}>
      <h1 className="page-title">{t("home.recentPosts")}</h1>
      <Outlet />
      <div className="grid-3" style={{ alignItems: "start", marginTop: "1rem" }}>
        <div>{user ? <NewPost /> : <Ad />}</div>
        {loading ? (
          <Card><CardContent><h2>{t("home.loadingPosts")} <img src="spinner.svg" alt="" height={24} style={{ position: "relative", top: ".25rem", left: "1rem" }} /></h2></CardContent></Card>
        ) : (
          posts && posts.map((post: any) => <Post post={post} key={post.id} />)
        )}
      </div>
    </div>
  );
}

export default Home;
