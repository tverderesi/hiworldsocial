import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getPictureURL, profilePictureDictionary } from "../util/profilePictureDictionary";

export function ProfilePictureSelector({ values, update = false }) {
  const { t } = useTranslation();
  const [selectedPicture, setSelectedPicture] = useState(values.profilePicture);
  const [loadingPic, setLoadingPic] = useState(true);

  const handleImageClick = (e) => {
    e.preventDefault();
    values.profilePicture = e.target.alt;
    setSelectedPicture(e.target.alt);
  };

  return (
    <div style={{ marginTop: "2rem", width: "100%" }}>
      <h2 style={{ marginBottom: "2em", marginTop: "1em", width: "100%", textAlign: "center" }}>{update ? t("profile.selectNewAvatar") : t("profile.selectAvatar")}</h2>
      <div className="grid-3">
        {profilePictureDictionary.map((item) => (
          <div key={item.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
            <img
              src={getPictureURL(item.name)}
              alt={item.name}
              className="avatar"
              onClick={handleImageClick}
              style={{
                width: "70px",
                height: "70px",
                boxShadow: selectedPicture === item.name ? "0 1px 3px 0 #9627ba,0 0 0 2px #9627ba" : "",
                background: loadingPic ? "linear-gradient(90deg, #c9c9c9, #f4f4f4, #c9c9c9 )" : "",
                backgroundSize: loadingPic ? "400% 400%" : "",
                animation: loadingPic ? "gradientAnimation 1s ease infinite" : "",
                cursor: "pointer",
              }}
              onLoad={() => setLoadingPic(false)}
            />
            <h4 style={{ textTransform: "capitalize", fontWeight: item.name === selectedPicture ? "bold" : "200", marginTop: ".5rem" }}>{item.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
