import styled from "styled-components";

export const Cancel = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 0;

  .list-radios {
    display: flex;
    gap: 20px;
  }

  input:not([type="color"]):read-only,
  textarea:read-only {
    cursor: pointer !important;
  }

  .input_control {
    margin-bottom: 0;
  }
`;
