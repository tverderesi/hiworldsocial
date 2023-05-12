export const profilePictureDictionary = [
  { name: "ade", v: "v1" },
  { name: "chris", v: "v1" },
  { name: "christian", v: "v1" },
  { name: "daniel", v: "v1" },
  { name: "elliot", v: "v1" },
  { name: "elyse", v: "v2" },
  { name: "helen", v: "v1" },
  { name: "jenny", v: "v1" },
  { name: "joe", v: "v1" },
  { name: "justen", v: "v1" },
  { name: "kristy", v: "v2" },
  { name: "lena", v: "v2" },
  { name: "laura", v: "v1" },
  { name: "lindsay", v: "v2" },
  { name: "mark", v: "v2" },
  { name: "matt", v: "v1" },
  { name: "matthew", v: "v2" },
  { name: "molly", v: "v2" },
  { name: "nan", v: "v1" },
  { name: "patrick", v: "v2" },
  { name: "rachel", v: "v2" },
  { name: "steve", v: "v1" },
  { name: "stevie", v: "v1" },
  { name: "veronika", v: "v1" },
];

export const getPictureURL = (name) => {
  const filteredArray = profilePictureDictionary.filter(
    (item) => item.name === name
  );
  if (filteredArray.length === 0) return undefined;
  return filteredArray[0].v === "v1"
    ? `https://semantic-ui.com/images/avatar/large/${filteredArray[0].name}.jpg`
    : `https://semantic-ui.com/images/avatar2/large/${filteredArray[0].name}.png`;
};
