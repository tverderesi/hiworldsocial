import { Grid, GridColumn, Image } from "semantic-ui-react";
import { useState } from "react";
import { getPictureURL } from "../util/profilePictureDictionary";
import { profilePictureDictionary } from "../util/profilePictureDictionary";

export function ProfilePictureSelector({ values, update = false }) {
  const [selectedPicture, setSelectedPicture] = useState(values.profilePicture);
  const [loadingPic, setLoadingPic] = useState(true);

  const handleImageClick = (e) => {
    e.preventDefault();
    values.profilePicture = e.target.alt;
    setSelectedPicture(e.target.alt);
  };

  return (
    <Grid
      style={{
        marginTop: "2rem",
      }}
      relaxed
      centered
      columns={8}
    >
      <Grid.Row>
        <h2
          style={{
            marginBottom: "2em",
            marginTop: "1em",
            width: "100%",

            textAlign: "center",
          }}
        >
          {`  Select ${update ? "a new" : "an"} Avatar`}
        </h2>
      </Grid.Row>
      <Grid.Row>
        {profilePictureDictionary.map((item) => {
          return (
            <GridColumn
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "auto auto",
                marginBottom: "1.5rem",
              }}
              key={item.name}
              computer={2}
              tablet={2}
              mobile={4}
            >
              <Image
                value={selectedPicture}
                src={getPictureURL(item.name)}
                alt={item.name}
                circular
                onClick={handleImageClick}
                style={{
                  boxShadow:
                    selectedPicture === item.name
                      ? "0 1px 3px 0 #9627ba,0 0 0 2px #9627ba"
                      : "",

                  background: loadingPic
                    ? "linear-gradient(90deg, #c9c9c9, #f4f4f4, #c9c9c9 )"
                    : "",

                  backgroundSize: loadingPic ? "400% 400%" : "",
                  animation: loadingPic
                    ? "gradientAnimation 1s ease infinite"
                    : "",
                }}
                size="small"
                onLoad={() => {
                  setLoadingPic(false);
                }}
              />
              <h4
                key={item.name}
                style={{
                  textTransform: "capitalize",
                  fontWeight: item.name === selectedPicture ? "bold" : "200",
                  marginTop: ".5rem",
                }}
              >
                {item.name}
              </h4>
            </GridColumn>
          );
        })}
      </Grid.Row>
    </Grid>
  );
}
