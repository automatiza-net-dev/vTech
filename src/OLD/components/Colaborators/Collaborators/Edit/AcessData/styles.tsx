import styled from "styled-components";

export const AccessData = styled.div`
  padding: 20px;
  border: 2px solid #ebebeb;
  border-radius: 20px;
  background-color: #fff;

  .header-table,
  .body-table {
    gap: 10px;
    display: grid;
    margin-top: 20px;
    grid-template-columns: 2fr 2fr 2fr 1fr;
  }

  input[type="checkbox"] {
    height: 20px !important;
  }

  button {
    background: ${(props) => props.theme.primaryColor} !important;
  }

  .form-button {
    display: flex !important;
    justify-content: right;
    gap: 10px;
  }
`;
