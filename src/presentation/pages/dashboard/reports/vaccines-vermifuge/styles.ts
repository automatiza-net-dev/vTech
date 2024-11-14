import styled from "styled-components";

export const VaccinesVermifuge = styled("div")`
  section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px;
    .custom-grid-box {
      grid-column-start: 1;
      grid-column-end: 3;
    }
  }
  .actions-box {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    button {
      background-color: ${(props) => props.theme.primaryColor} !important;
    }
  }

  .react-daterange-picker__inputGroup {
    width: 100% !important;
  }
  .date-container {
    width: 100%;

    button {
      min-width: 22px;

      &:last-child {
        min-width: 30px;
      }
    }

    .react-daterange-picker {
      width: 100%;
    }
  }
`;
