import moment from "moment";

export function DateToYYYYMMDD(date: Date) {
    const formattedDate = moment(date?.toISOString()).format('YYYY-MM-DD');
    
    return formattedDate;
}