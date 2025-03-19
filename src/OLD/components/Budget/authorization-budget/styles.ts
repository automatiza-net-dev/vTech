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

  
  }
`;
