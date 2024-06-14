import styled from "styled-components";

export const CardTimeLine = styled("button")<{ $isTimeLineSelected: boolean }>`
  border-radius: 5px;
  border: 1px solid
    ${(props) =>
      props.$isTimeLineSelected ? props.theme.primaryColor : "#e1e1e1"};
  padding: 15px;
  background-color: transparent;
  width: 100%;
  margin-bottom: 15px;

  .top {
    display: flex;
    align-items: flex-start;
    text-align: left;
    justify-content: space-between;
    margin-bottom: 6px;

    h3 {
      font-size: 16px;
      font-weight: 700;
      color: ${(props) => props.theme.primaryColor};
      margin-bottom: 0;

      strong {
        color: #2b2b2b;
      }
    }

    .icons {
      display: flex;
      flex-direction: column;
      gap: 15px;

      svg {
        fill: #828282;
        height: 24px;
        width: auto;
      }
    }
  }

  span {
    font-size: 14px;
    color: #828282;
    display: block;
    text-align: left;
  }
`;
