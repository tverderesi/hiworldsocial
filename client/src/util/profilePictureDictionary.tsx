export const profilePictureDictionary = [
  { name: 'ade', isSelected: true, v: 'v1' },
  { name: 'chris', isSelected: false, v: 'v1' },
  { name: 'christian', isSelected: false, v: 'v1' },
  { name: 'daniel', isSelected: false, v: 'v1' },
  { name: 'elliot', isSelected: false, v: 'v1' },
  { name: 'elyse', isSelected: false, v: 'v2' },
  { name: 'helen', isSelected: false, v: 'v1' },
  { name: 'jenny', isSelected: false, v: 'v1' },
  { name: 'joe', isSelected: false, v: 'v1' },
  { name: 'justen', isSelected: false, v: 'v1' },
  { name: 'kristy', isSelected: false, v: 'v2' },
  { name: 'lena', isSelected: false, v: 'v2' },
  { name: 'laura', isSelected: false, v: 'v1' },
  { name: 'lindsay', isSelected: false, v: 'v2' },
  { name: 'mark', isSelected: false, v: 'v2' },
  { name: 'matt', isSelected: false, v: 'v1' },
  { name: 'matthew', isSelected: false, v: 'v2' },
  { name: 'molly', isSelected: false, v: 'v2' },
  { name: 'nan', isSelected: false, v: 'v1' },
  { name: 'patrick', isSelected: false, v: 'v2' },
  { name: 'rachel', isSelected: false, v: 'v2' },
  { name: 'steve', isSelected: false, v: 'v1' },
  { name: 'stevie', isSelected: false, v: 'v1' },
  { name: 'veronika', isSelected: false, v: 'v1' },
];

export const getPictureURL = name => {
  const filteredArray = profilePictureDictionary.filter(
    item => item.name === name
  );
  if (filteredArray.length === 0) return null;
  return filteredArray[0].v === 'v1'
    ? `https://semantic-ui.com/images/avatar/large/${filteredArray[0].name}.jpg`
    : `https://semantic-ui.com/images/avatar2/large/${filteredArray[0].name}.png`;
};
