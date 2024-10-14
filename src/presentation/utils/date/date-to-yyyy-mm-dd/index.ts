import moment from "moment";

export function DateToYYYYMMDD(date: Date) {
  if (!date || !(date instanceof Date)) {
    return null;
  }

  const formattedDate = moment(date?.toISOString())
    .add(3, "hours")
    .format("YYYY-MM-DD");

  return formattedDate;
}
