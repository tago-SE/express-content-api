export const isPage = (content: any) => {
  if (!content) return false;
  if (
    !content.contentType ||
    !Array.isArray(content.contentType) ||
    content.contentType.length !== 2
  ) {
    throw new Error("Invalid contentType");
  }
  return content.contentType[0] === "Page";
};
