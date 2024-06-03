import styled from "styled-components";

export const Container = styled.div`
  .cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 900px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;
