import styled from "styled-components";

export const DailyCashier = styled("div")`
  .right {
    height: fit-content;
    min-width: max-content;
    margin: auto 0 0;

    button {
      border: none;
      height: 40px;
    }
  }

  .form-button {
    button {
      height: 40px;
    }
  }

  form {
    margin-right: 5px;

    .container-switch {
      width: 100%;
    }
  }

  form > div {
    border: none;
    padding: 0;

    > div:first-child {
      button {
        background: none !important;
        min-width: 16px;
        min-height: 16px;
        padding: 0;
      }
    }

    .react-daterange-picker {
      width: 400px;
    }

    .react-daterange-picker__inputGroup {
      width: 100% !important;
    }
  }
`;
