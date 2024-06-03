import styled from "styled-components";

export const ScheduleUserCalendar = styled("div")<{ $height: number }>`
  width: 100%;
  padding-bottom: 50px;
  .top-name {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #6e6e6e;
    border-radius: 5px 5px 0px 0px;
    overflow: hidden;
    padding: 10px 20px;

    h3 {
      text-align: center;
      color: #fff;
    }
  }

  .fc-scroller-harness {
    border-radius: 5px;
  }

  td[role="presentation"] {
    padding: 0;
  }

  table {
    background: #fff;

    tr {
      height: ${props => props.$height + "px"};
    }
  }
`;
