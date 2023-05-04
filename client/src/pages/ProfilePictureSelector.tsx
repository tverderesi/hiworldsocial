import { Button, Grid, GridColumn, Image } from "semantic-ui-react";
import React from "react";
import { getPictureURL } from "../util/profilePictureDictionary";

export function ProfilePictureSelector({
  placeholderNames,
  handleImageClick,
}: {
  placeholderNames: { name: string; isSelected: boolean; v: string }[];
  handleImageClick: (index: any) => void;
}) {
  return (
    <Grid
      style={{
        marginTop: "2rem",
        borderRadius: ".28571429rem",
        // boxShadow: '0 1px 3px 0 #d4d4d5,0 0 0 1px #d4d4d5',
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
          Select an Avatar
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
              tablet={4}
              mobile={8}
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
                }}
                size="small"
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
