import styled from "styled-components";

export const Container = styled.div`
  .installment-button {
    cursor: pointer;
    width: 20px;
    border-radius: 5px;
    :hover {
      color: var(--blue);
    }
  }

  .selected-installments {
    background-color: var(--blue) !important;
  }

  footer {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;
