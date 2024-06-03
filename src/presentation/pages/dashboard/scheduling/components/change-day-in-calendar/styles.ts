import styled from "styled-components";

export const ChangeDayInCalendar = styled("div")`
  width: fit-content;
  display: flex;
  align-items: center;
  height: 38px;
  gap: 10px;

  .react-date-picker {
    height: 100%;
  }

  .react-date-picker__wrapper {
    flex-direction: row-reverse;
    width: 100%;
    height: 100%;
    padding: 0 20px;
    max-width: 162px;
    background-color: #fff;
    border: 1px solid #b0b0b0;
    border-radius: 5px;
    color: #6e6e6e;
    font-size: 15px;
    gap: 10px;

    .react-date-picker__calendar-button {
      padding: 0;
    }

    svg {
      width: 15px;
      height: auto;
      color: #6e6e6e;
    }
  }

  > button {
    height: 100%;
    width: 25px;
    padding: 0;
    border: 0;
    height: 25px;
    background: ${props => props.theme.primaryColor};
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      width: 7px;
      height: auto;
      display: flex;

      svg {
        width: 100%;
        height: auto;
      }
    }
  }
`;
