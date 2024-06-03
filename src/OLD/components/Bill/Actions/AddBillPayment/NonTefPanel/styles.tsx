import styled from "styled-components";

export const Container = styled.div`
  .card-box {
    :hover {
      cursor: pointer;
      color: var(--blue);
    }
  }

  .payment-selected {
    background-color: var(--blue);
    :hover {
      cursor: pointer;
      color: #ffffff;
    }
  }
`;
