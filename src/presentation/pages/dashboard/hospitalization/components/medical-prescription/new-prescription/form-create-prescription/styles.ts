import styled from "styled-components";

export const FormCreatePrescription = styled("div")`
  input[type="radio"] {
    height: 20px;
    width: 20px;
  }

  .row {
    align-items: flex-start;
  }

  .list-radios {
    display: flex;
    align-items: center;
    gap: 20px;

    label {
      display: flex;
      cursor: pointer;
      gap: 6px;
      align-items: center;
    }
  }

  .row {
    .row {
      > * {
        min-width: 105px;
      }
    }
  }
`;
