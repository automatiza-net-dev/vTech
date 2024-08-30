import styled from "styled-components";

export const Container = styled.section`
  margin-top: 20px;
  .budget-payment-desc {
    border: 1px #cacaca solid;
    padding: 10px;
    border-radius: 5px;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }

  .card-box {
    :hover {
      cursor: pointer;
      color: var(--blue);
    }
  }

  .flag-selected {
    background-color: var(--blue);
    :hover {
      cursor: pointer;
      color: #ffffff;
    }
  }

  .text-small {
    font-size: 0.9em;
  }

  .installment-button {
    cursor: pointer;
    width: 20px;
    border-radius: 5px;
    :hover {
      color: var(--blue);
    }
  }

  .selected-installments {
    background-color: var(--blue);
  }
`;
