import React from "react";

import { Icon } from "infinity-forge"

import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import styled from "styled-components";

const Container = styled.div`
  .LiftOne-button {
    background-color: var(--lo-blue);
    border-radius: 5px;
  }

  .Sanclá-button {
    background-color: var(--orange);
    border-radius: 5px;
  }

  .Vetech-button {
    background-color: var(--blue);
    border-radius: 5px;
  }

  input {
    text-align: center;
    max-width: 200px;
    font-size: 18px;
    color: var(--gray);
  }
  .ant-picker-suffix {
    display: none;
  }
`;

export default function Date({
  selectedDate,
  setSelectedDate,
  classCallback = false
}) {
  return (
    <Container
      className={`uk-flex uk-flex-middle uk-flex-between ${
        classCallback ? classCallback : ""
      }`}
    >
      <button
        className={`uk-button bgDarkCyan bgCyanHover ${process.env.clientName}-button`}
        onClick={() =>
          setSelectedDate(moment(selectedDate).subtract(1, "days"))
        }
      >
        <Icon name="NavLeftIcon" stroke="#fff" />
      </button>
      <DatePicker
      slotProps={{ textField: { size: 'small' } }}
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
        }}
        format="DD/MM/YYYY"
        className="uk-text-center"
      />
      <button
        className={`uk-button bgDarkCyan bgCyanHover ${process.env.clientName}-button`}
        onClick={() => setSelectedDate(moment(selectedDate).add(1, "days"))}
      >
        
        <Icon name="NavRightIcon" stroke="#fff"/>
      </button>
    </Container>
  );
}

