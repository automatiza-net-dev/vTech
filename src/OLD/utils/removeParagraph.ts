export const removeParagraph = (value) => {
  value = value.replace(/<\/p>/gi, "\n");
  return value;
};
