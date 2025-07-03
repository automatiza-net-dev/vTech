import styled from "styled-components";

export const Filters = styled.div`
  width: 100%;

  form {
    > div {
      display: flex;
      align-items: center;
    }

    .form-button {
      button {
        background: ${(props) => props.theme.primaryColor};
      }
    }
  }

  .conntent_form_infinity_forge {
    display: flex;
    width: 100%;
    align-items: end;
    gap: 20px;
    margin-bottom: 20px;

    .input_control {
      margin: 0;
    }

    > div {
      max-width: 300px;
    }
  }
`;
