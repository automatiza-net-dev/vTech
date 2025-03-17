import styled from "styled-components";

export const Cancel = styled("div")`
  display: flex;
  padding: 5px 0;
  gap: 15px;

  > div {
    width: 100%;
  }

  .input-content {
      margin-top: 5px;
    }

  .list-radios {
    display: flex;
    gap: 15px !important;
    margin-bottom: 20px;

 
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
