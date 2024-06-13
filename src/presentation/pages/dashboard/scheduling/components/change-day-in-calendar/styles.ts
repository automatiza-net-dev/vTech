import styled from "styled-components";

export const ChangeDayInCalendar = styled("div")`
  width: fit-content;
  display: flex;
  align-items: center;
  height: 38px;
  gap: 10px;
  margin-top: 10px;



  > button {
    height: 100%;
    width: 25px;
    padding: 0;
    border: 0;
    height: 25px;
    background: ${(props) => props.theme.primaryColor};
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
