import moment from "moment";

export function DateToHHMMDDMMYYYY(dateString: string) {
  if (!dateString) {
    return null;
  }

  const formattedDate = moment(dateString)
    .add(3, "hours")
    .format("HH:mm DD/MM/YYYY");

  return formattedDate;
}
