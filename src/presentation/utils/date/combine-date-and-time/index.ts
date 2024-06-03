import moment from 'moment';

export function combineDateAndTime(currentDate?: Date, time?: string) {
  try {
    const result = moment(`${currentDate?.toISOString().substring(0, 10)}T${time}`).format('YYYY-MM-DDTHH:mm');

    return result;
  } catch {
    return "@COMBINE_DATE_AND_TIME: ERROR";
  }
}