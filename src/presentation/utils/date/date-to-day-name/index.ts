import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

export function dateToDayName(dataStr) {
  const data = moment(dataStr, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");

  return data.format("dddd");
}
