import { useState, useEffect, useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import { Autocomplete, TextField, Checkbox, Chip } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { useScheduling } from "../../context";
import { CalendarEvent } from "../schedule-user-calendar/components";
import {
  DateToYYYYMMDD,
  combineDateAndTime,
  useLoadAllSchedulesUserWeek,
  useLoadProfessionalsSchedule,
} from "@/presentation";

import { configsWeekCalendar } from "./configs";

import * as S from "./styles";

type ProfessionalOption = { label: string; value: string };
const SELECT_ALL_VALUE = "__select_all__";

export function WeekCalendar({
  viewCalendar,
  setViewCalendar,
}: {
  viewCalendar: "day" | "week";
  setViewCalendar: React.Dispatch<React.SetStateAction<"day" | "week">>;
}) {
  const [weekRange, setWeekRange] = useState({
    from: null,
    to: null,
    professionals: [] as string[],
  });
  const [selectedProfessionals, setSelectedProfessionals] = useState<ProfessionalOption[]>([]);
  const allInitialized = useRef(false);

  const changeDate = useScheduling((state) => state.changeDate);
  const selectedDate = useScheduling((state) => state.selectedDate);
  const listCancelledEvents = useScheduling(
    (state) => state.listCancelledEvents
  );

  const professionals = useLoadProfessionalsSchedule();

  const allOptions: ProfessionalOption[] =
    professionals?.data?.map((p) => ({ label: p.name, value: p.id })) || [];

  useEffect(() => {
    if (allOptions.length > 0 && !allInitialized.current) {
      allInitialized.current = true;
      setSelectedProfessionals(allOptions);
      setWeekRange((state) => ({
        ...state,
        professionals: allOptions.map((p) => p.value),
      }));
    }
  }, [allOptions.length]);

  const isAllSelected = selectedProfessionals.length === allOptions.length && allOptions.length > 0;

  const handleChange = (_: any, newValue: ProfessionalOption[]) => {
    const toggleAll = newValue.find((opt) => opt.value === SELECT_ALL_VALUE);
    const next = toggleAll
      ? isAllSelected ? [] : allOptions
      : newValue;

    setSelectedProfessionals(next);
    setWeekRange((state) => ({
      ...state,
      professionals: next.map((p) => p.value),
    }));
  };

  const { data, refetchKeyWeekCalendar } = useLoadAllSchedulesUserWeek(
    DateToYYYYMMDD(weekRange?.to || new Date()) || "",
    DateToYYYYMMDD(weekRange?.from || new Date()) || "",
    weekRange.professionals,
    listCancelledEvents
  );

  const reducedEvents = data?.reduce((reducer: any, item: any) => {
    const list = item.events.reduce((r, ev) => {
      const eventsToAdd = ev.events.map((eventAdd) => ({
        ...eventAdd,
        scheduleUser: ev.user,
      }));

      return [...r, ...eventsToAdd];
    }, []);

    return [...reducer, ...list];
  }, []);

  const events = reducedEvents
    ?.filter((ev) => ev.type !== "working")
    ?.map((event) => {
      if (event.type === "unavailable") {
        return {
          props: event,
          end: combineDateAndTime(selectedDate, event.end),
          start: combineDateAndTime(selectedDate, event.start),
        };
      }

      return {
        props: { ...event, scheduleUser: event.scheduleUser },
        end: event.end.substring(0, 16),
        start: event.start.substring(0, 16),
      };
    });

  const extractTime = (dateTime) => {
    return dateTime.split("T")[1].substring(0, 5);
  };

  const minStart =
    events &&
    events.length > 0 &&
    events.reduce((min, event) => {
      const startTime = extractTime(event.start);
      return startTime < min ? startTime : min;
    }, extractTime(events[0].start));

  const maxEnd =
    events &&
    events.length > 0 &&
    events.reduce((max, event) => {
      const endTime = extractTime(event.end);
      return endTime > max ? endTime : max;
    }, extractTime(events[0].end));

  const selectAllOption: ProfessionalOption = {
    label: isAllSelected ? "Desmarcar todos" : "Marcar todos",
    value: SELECT_ALL_VALUE,
  };

  return (
    <S.WeekCalendar>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={[selectAllOption, ...allOptions]}
        value={selectedProfessionals}
        onChange={handleChange}
        getOptionLabel={(opt) => opt.label}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        renderOption={(props, option, { selected }) => {
          const isSelectAll = option.value === SELECT_ALL_VALUE;
          return (
            <li {...props} key={option.value}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={isSelectAll ? isAllSelected : selected}
                indeterminate={isSelectAll && selectedProfessionals.length > 0 && !isAllSelected}
              />
              {option.label}
            </li>
          );
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              label={option.label}
              size="small"
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={selectedProfessionals.length === 0 ? "Selecione profissionais..." : ""}
            variant="outlined"
            size="small"
          />
        )}
        style={{ marginBottom: 16 }}
      />

      {weekRange.professionals.length > 0 ? (
        <FullCalendar
          {...configsWeekCalendar}
          expandRows={true}
          eventMinHeight={50}
          dateClick={({ date }) => {
            changeDate(date);

            setViewCalendar("day");
          }}
          dayHeaderDidMount={function (arg) {
            arg.el.addEventListener("click", function () {
              changeDate(arg.date);

              setViewCalendar("day");
            });
          }}
          slotMaxTime={typeof maxEnd === "string" ? maxEnd : "23:59"}
          slotMinTime={typeof minStart === "string" ? minStart : "00:00"}
          events={events}
          initialDate={selectedDate}
          datesSet={(arg) => {
            const to = arg.end;
            const from = arg.start;

            setWeekRange((state) => ({
              from,
              to,
              professionals: state.professionals,
            } as any));
          }}
          eventContent={(event) => (
            <CalendarEvent
              showNameScheduleUser
              viewCalendar={viewCalendar}
              refetchKeyWeekCalendar={refetchKeyWeekCalendar}
              event={event.event._def.extendedProps.props}
              scheduleUser={event.event._def.extendedProps.props.scheduleUser}
            />
          )}
        />
      ) : (
        <p>
          Por favor selecione ao menos um profissional para ver o calendário
          semanal
        </p>
      )}
    </S.WeekCalendar>
  );
}
