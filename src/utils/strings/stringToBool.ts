export function stringToBoolean(str: string) {
  if (!str) return false;
  if (typeof str !== "string") return false;
  switch (str?.toLowerCase()?.trim()) {
    case "true":
    case "yes":
    case "1":
      return true;
  }
  return false;
}
