import { useEffect } from "react";

import moment from "moment";
import { add, sub } from "date-fns";
import { useFormikContext } from "formik";
import { InputDatePicker, FormHandler } from "infinity-forge";

import { useScheduling } from "@/presentation";
import { LeftArrow, RightArrow } from "./icons";

import * as S from "./styles";

export function ChangeDayInCalendar() {
  const changeDate = useScheduling((state) => state.changeDate);
  const selectedDate = useScheduling(state => state.selectedDate)

  function handleDayAdvance() {
    const nextDay = add(selectedDate || new Date(),  { days: 1 });
    changeDate(nextDay);
  }

  function handleDayRetreat() {
    const previousDay = sub(selectedDate || new Date(), { days: 1 });

    changeDate(previousDay);
  }

  return (
    <S.ChangeDayInCalendar>
     <button onClick={handleDayRetreat}>
        <div className="icon">
          <RightArrow />
        </div>
      </button> 

      <FormHandler
        cleanFieldsOnSubmit={false}
        onChangeForm={{
          callbackResult: (data) => {
            if (data.date) changeDate(data.date);
          },
        }}
      >
        <DatePickerSchedule /> 
      </FormHandler>

    <button onClick={handleDayAdvance}>
        <div className="icon">
          <LeftArrow />
        </div>
      </button> 
    </S.ChangeDayInCalendar>
  );
}
function DatePickerSchedule() {
  const { values, setFieldValue } = useFormikContext<{ date: string }>();
  const selectedDate = useScheduling((state) => state.selectedDate);

  useEffect(() => {
    const formikDate = new Date(values["date"]).getTime();
    const selectedDateMilliseconds = selectedDate?.getTime();

    if (formikDate !== selectedDateMilliseconds) {
      setFieldValue("date", moment(selectedDate).toDate());
    }
  }, [selectedDate]);

  return <InputDatePicker language="pt" name="date" mode="date"  />;
}
