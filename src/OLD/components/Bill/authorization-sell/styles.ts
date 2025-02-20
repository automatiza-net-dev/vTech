import styled from "styled-components";

export const AuthorizationSell = styled.div`
  width: 100%;

  .payments > div {
    border-radius: 0;
  }

  table thead {
    height: 36px;
    tr {
      height: 36px;
    }
  }

  .inputs {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 150px) repeat(2, 1fr);
    align-items: center;
    gap: 10px;
    margin-bottom: 3rem;

    input {
      width: 100%;
      height: 3rem;
      opacity: 0.5;
      padding: 0 12px;
      cursor: not-allowed;
    }
  }

  .accordion {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    margin: 10px 0;
    padding: 0;
    box-shadow: unset !important;

    .input_control {
      margin: 0;
    }

    button {
      padding: 10px;
    }

    .list-radios {
      display: flex;
      
      label {
        margin: 0;
      }
      input {
        height: 20px;
      width: 20px;
      padding: 0;
      }
      span {
        display: none;
      }
    }

    input:not([type="color"]):read-only {
      opacity: 0.9;
      cursor: pointer;
      background-color: #f2f2f2;
    }
  }

  .form_cancel {
    .form-button > div {
      display: flex;
      justify-content: flex-end;
    }
  }

  form {
    margin: 0 auto;

    button {
      width: 100%;
    }

    button:disabled {
      opacity: 0.8;
      cursor: not-allowed;
    }

    .form-button {
      > div {
        width: 100%;
      }
    }

    .ant-collapse {
      margin: 0 0 10px 0 !important;
    }

    .conntent_form_infinity_forge {
      padding: 0 !important;

    }

    .form-button {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      gap: 5px;

      > div {
        width: 100%;

        button {
          width: 100% !important;
          background: ${(props) => props.theme.primaryColor};
        }
      }
    }
  }
`;
