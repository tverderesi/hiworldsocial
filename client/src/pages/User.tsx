import { useContext } from "react";
import { useQuery } from "@apollo/client";
import {
  Image,
  Loader,
  Card,
  Grid,
  GridColumn,
  Button,
} from "semantic-ui-react";
import { GET_USER_QUERY } from "../util/GraphQL";
import { AuthContext } from "../context/auth";
import { useNavigate, useParams, Link } from "react-router-dom";
import moment from "moment";
import { getPictureURL } from "../util/profilePictureDictionary";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user } = useContext(AuthContext) as any;
  const { loading, error, data } = useQuery(GET_USER_QUERY, {
    variables: { username: username },
  });

  if (loading) return <Loader active />;
  if (error) return <p>Error: {error.message}</p>;

  const { id, email, createdAt, profilePicture } = data.getUser;
  const isAuthUser = user?.username === username;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: "50",
        width: "100vw",
        height: "100vh",
        left: "0",
        top: "0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.1)",
        backdropFilter: "blur(5px)",
      }}
    >
      <Grid centered style={{ flexGrow: "1" }}>
        <GridColumn width={16}>
          <Card centered raised>
            <Button
              icon="close"
              circular
              color="red"
              size="mini"
              onClick={() => {
                navigate(-1);
              }}
              style={{
                position: "absolute",
                width: "30px",
                height: "30px",
                top: "5px",
                right: "5px",
                zIndex: "100",
              }}
            />
            <Image src={getPictureURL(profilePicture)} alt="profile" centered />
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>
                <span className="date">
                  Joined {moment(createdAt).fromNow()}
                </span>
              </Card.Meta>
            </Card.Content>

            {isAuthUser && (
              <Card.Content extra>
                <Button as={Link} to="/profile/editprofile" primary>
                  Edit Profile
                </Button>
              </Card.Content>
            )}
          </Card>
        </GridColumn>
      </Grid>
    </div>
  );
}
