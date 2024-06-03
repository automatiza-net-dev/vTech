import moment from "moment";

export const convertDate = (date) => {
  const format = "DD/MM/YYYY";
  const dateTime = moment(date, "YYYY-MM-DD[T]HH:mm:ss").format(format);

  // const dateTime = moment(newDate, "YYYY-MM-DD[T]HH:mm:ss").format(format);

  return dateTime;
};

export const convertTime = (date) => {
  const format = "HH:mm";
  const newDate = new Date(date);

  return moment(newDate).add(3, "hours").format(format)
};
