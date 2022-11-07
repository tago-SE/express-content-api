export const removeTrailingSlashes = (str: string) => {
  if (!str) return "";

  let len = str.length;
  for (let i = str.length - 1; i > 0; i--) {
    if (str[i] === "/") {
      len--;
    } else {
      break;
    }
  }
  return str.substring(0, len);
};
