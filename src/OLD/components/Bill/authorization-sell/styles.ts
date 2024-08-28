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

  form {
    max-width: 520px;
    margin: 0 auto;

    .conntent_form_infinity_forge {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, max-content);
      align-items: center;
      column-gap: 5px;
      grid-template-areas:
        "first second"
        "third third";

      > div:nth-child(1) {
        grid-area: first;
      }
      > div:nth-child(2) {
        grid-area: second;
      }
      > div:nth-child(3) {
        grid-area: third;
      }
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
