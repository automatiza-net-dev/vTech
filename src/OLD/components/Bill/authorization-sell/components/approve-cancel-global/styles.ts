import styled from "styled-components";

export const Cancel = styled("div")`
  display: flex;
  padding: 5px 0;
  gap: 15px;

  .ql-editor {
    min-height: 109px !important;
  }

  > div {
    width: 100%;
  }

  .input-content {
    margin-top: 5px;
  }

  .container-switch {
    margin-top: 5px; 
    
    .input-content {
      margin-top: 0;
    }
  }

  .list-radios {
    display: flex;
    gap: 15px !important;
    margin-bottom: 4px;

    label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 15px !important;

      input {
        height: 20px;
        width: 20px;
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
