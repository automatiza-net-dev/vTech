import styled from "styled-components";

export const DreGroupsTable = styled.div`
  margin-top: 30px;

  .top-actions {
    display: flex;
    align-items: flex-end;
  }

  .form-button {
    width: 120px;
    margin-right: 5px;

    button {
      height: 40px !important;
      width: 100% !important;
      border-radius: 4px !important ;
    }
  }

  form {
    width: 100%;

    > div {
      border: none;
      padding: 0;
    }

    button {
      background: ${(props) => props.theme.primaryColor} !important;
      padding: 2px !important;
    }
  }

  label {
    font-weight: 600 !important;
    margin-left: 10px;
  }

  input {
    width: 100%;
    display: flex;
    align-items: center;
    height: 40px;
    background-color: #fff;
    border-radius: 40px;
    padding: 0 20px;
    border: 0.5px solid #cacaca;

    input {
      margin-left: 10px;
      width: 100%;
      border: none;
    }
  }
`;
