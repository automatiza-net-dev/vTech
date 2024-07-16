import styled from "styled-components";

export const Container = styled.div`
  header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .payment-detail-container {
    background-color: #ffffff;
    border-radius: 5px;

    .action-icon {
      cursor: pointer;
    }
  }
`;
