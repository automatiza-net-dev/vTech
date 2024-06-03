import moment from "moment";

export function DateToDDMMYYYY(date: Date | string) {
  if(!date) {
    return null
  }

  const dataFormatada = moment(date.toLocaleString()).format("DD/MM/YYYY");

  return dataFormatada;
}
