import styled from "styled-components";

export const AuthorizationSell = styled.div`
  width: 100%;

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

  .form_cancel {
    .form-button > div {
      display: flex;
      justify-content: flex-end;
    }
  }

  form {
    margin: 0 auto;

    button:disabled {
      opacity: 0.8;
      cursor: not-allowed;
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
      gap: 5px;

      > div {
        width: 100%;

        button {
          background: ${(props) => props.theme.primaryColor};
        }
      }
    }
  }
`;
