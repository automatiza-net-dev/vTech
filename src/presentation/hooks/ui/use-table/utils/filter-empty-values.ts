import { isObjectEmpty } from "./is-object-empty";

export function filterEmptyValues(obj) {
  const filteredObj = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "object") {
      const filteredValue = filterEmptyValues(value);
      if (!isObjectEmpty(filteredValue)) {
        filteredObj[key] = filteredValue;
      }
    } else if (value !== "" && value !== false) {
      filteredObj[key] = value;
    }
  }
  return filteredObj;
}
