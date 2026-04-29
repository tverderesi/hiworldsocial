import { Card } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

export default function Ad() {
  const { t } = useTranslation();
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
            {t("welcome.ad")} 🌎
          </Card.Header>
        </Card.Content>
      </Card>
    </>
  );
}
