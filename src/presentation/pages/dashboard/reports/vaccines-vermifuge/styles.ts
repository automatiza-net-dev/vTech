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
    .date-container {
      display: flex;
      gap: 5px;
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
`;
