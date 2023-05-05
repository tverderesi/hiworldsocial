import { Button, Grid, GridColumn, Image } from "semantic-ui-react";
import { useState } from "react";
import { getPictureURL } from "../util/profilePictureDictionary";
import { profilePictureDictionary } from "../util/profilePictureDictionary";
import roundSpinner from "./roundSpinner.svg";

export function ProfilePictureSelector({ values, update = false }) {
  const [loading, setLoading] = useState(true);
  const [placeholderNames, setPlaceholderNames] = useState(
    profilePictureDictionary
  );
  const [loadingPic, setLoadingPic] = useState(true);
  const handleImageClick = (index) => {
    setPlaceholderNames((prevState) => {
      const newNames = prevState.map((item, i) => {
        if (i === index) {
          item.isSelected = true;

          values.profilePicture = item.name;
        } else {
          item.isSelected = false;
        }
        return item;
      });
      return newNames;
    });
  };

  return (
    <Grid
      style={{
        marginTop: "2rem",
      }}
      relaxed
      centered
      columns={8}
      onLoad={() => {
        setLoading(false);
      }}
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
        {placeholderNames.map((item, index) => {
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
                src={getPictureURL(item.name)}
                circular
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault();
                  handleImageClick(index);
                }}
                style={{
                  boxShadow: item.isSelected
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
                  fontWeight: item.isSelected ? "bold" : "200",
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
