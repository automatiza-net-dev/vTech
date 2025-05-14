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

// export function DateToYYYYMMDDSchedule(date: Date) {
//   if (!date || !(date instanceof Date)) {
//     return null;
//   }

//   const formattedDate = moment(date).format("YYYY-MM-DD");

//   return formattedDate;
// }

export function DateToYYYYMMDDSchedule(date: Date): string | null {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}