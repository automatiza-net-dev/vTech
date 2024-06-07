import { format, add, sub } from "date-fns";

import { useScheduling } from "@/presentation";
import { LeftArrow, RightArrow } from "./icons";

import * as S from "./styles";

export function ChangeDayInCalendar() {
  const [changeDate, selectedDate] = useScheduling((state) => [
    state.changeDate,
    state.selectedDate,
  ]);

  function handleDayAdvance() {
    if (selectedDate) {
      const nextDay = add(selectedDate, { days: 1 });
      changeDate(nextDay);
    }
  }

  function handleDayRetreat() {
    if (selectedDate) {
      const previousDay = sub(selectedDate, { days: 1 });
      changeDate(previousDay);
    }
  }

  return (
    <S.ChangeDayInCalendar>
      <button onClick={handleDayRetreat}>
        <div className="icon">
          <RightArrow />
        </div>
      </button>

      <input
        type="date"
        value={selectedDate && format(selectedDate, "yyyy-MM-dd")}
        onChange={(ev) => {
          if (ev.target.value) {
            changeDate(new Date(ev.target.value));
          }
        }}
      />

      <button onClick={handleDayAdvance}>
        <div className="icon">
          <LeftArrow />
        </div>
      </button>
    </S.ChangeDayInCalendar>
  );
}
