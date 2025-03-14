import styled from "styled-components";

export const Cancel = styled("div")`
  display: flex;
  padding: 5px 0;

  .list-radios {
    display: flex;
    flex-direction: column;
    gap: 5px !important;

    label {
      display: flex;
      align-items: center;
      gap: 5px;

      input {
        height: 20px;
        width: unset;
      }
    }
  }

  input:not([type="color"]):read-only,
  textarea:read-only {
    cursor: pointer !important;
  }

  .input_control {
    margin-bottom: 0;
  }
`;
