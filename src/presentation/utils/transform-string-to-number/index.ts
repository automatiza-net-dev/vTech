export function transformStringToNumber(str?: string | number) {

  if(typeof str === "number") {
    return str;
  }

  if (!str || typeof str !== "string") {
    return 0;
  }

  return parseFloat(str?.replace(",", "."));
}
