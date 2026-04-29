import { Card, CardContent } from "./ui/card";
import { useTranslation } from "react-i18next";

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
