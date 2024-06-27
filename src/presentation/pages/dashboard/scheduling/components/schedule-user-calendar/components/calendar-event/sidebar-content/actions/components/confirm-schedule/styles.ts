import styled from "styled-components";

export const ConfirmSchedule = styled("div")`
  .reset-button {
    background-color: ${(props) => props.theme.green} !important;
    color: #fff;
  }

  form {
    margin-bottom: 15px;
    margin-top: 10px;

    button {
      background-color: ${(props) => props.theme.green} !important;
      color: #fff;
      border: 0;
    }
  }
`;
