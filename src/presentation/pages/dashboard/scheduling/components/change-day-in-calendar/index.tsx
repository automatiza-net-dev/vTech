import { isValid, add, sub } from "date-fns";

import { useScheduling } from "@/presentation";
import { LeftArrow, RightArrow } from "./icons";

import SemanticDatepicker from 'react-semantic-ui-datepickers';

import * as S from "./styles";

export function ChangeDayInCalendar() {
  const [changeDate, selectedDate] = useScheduling<any>((state) => [
    state.changeDate,
    state.selectedDate,
  ]);

  function isValidDateInput(dateString) {
    return isValid(new Date(dateString));
  }

  function handleDateChange(value, data) {
    const isValidDate = isValidDateInput(data.value);

    if (isValidDate) {
      changeDate(data.value);
    }
  }

  function handleDayAdvance() {
    const nextDay = add(selectedDate, { days: 1 });
    changeDate(nextDay);
  }

  function handleDayRetreat() {
    const previousDay = sub(selectedDate, { days: 1 });
    changeDate(previousDay);
  }

  return (
    <S.ChangeDayInCalendar>
      <button onClick={handleDayRetreat}>
        <div className="icon">
          <RightArrow />
        </div>
      </button>


      <SemanticDatepicker locale="pt-BR" format="DD/MM/YYYY" onChange={handleDateChange} value={selectedDate} type="basic" clearIcon={undefined} />

      <button onClick={handleDayAdvance}>
        <div className="icon">
          <LeftArrow />
        </div>
      </button>
    </S.ChangeDayInCalendar>
  );
}
