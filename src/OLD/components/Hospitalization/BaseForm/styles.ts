import styled from "styled-components";

export const BaseForm = styled("div")`
  form {
    .form-button {
      gap: 10px;
      display: flex;
      flex-direction: row-reverse;
      margin-top: 10px;

      button:first-child {
        background-color: ${(props) => props.theme.primaryColor};
      }

      
    }
  }
`;
