import { Card } from "semantic-ui-react";

export default function Ad() {
  return (
    <>
      <Card
        fluid
        style={{ height: "100%" }}
      >
        <Card.Content
          color="black"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Card.Header
            style={{
              fontSize: "1.7rem",
              alignSelf: "center",

              width: "90%",
            }}
          >
            See what our users are talking about right now! 🌎
          </Card.Header>
        </Card.Content>
      </Card>
    </>
  );
}
