import { useTranslation } from "react-i18next";
import { Card, CardContent } from "./ui/card";

export default function Ad() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <h2 style={{ fontSize: "1.7rem", textAlign: "center" }}>{t("welcome.ad")} 🌎</h2>
      </CardContent>
    </Card>
  );
}
