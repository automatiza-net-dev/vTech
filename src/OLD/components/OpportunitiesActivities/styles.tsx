import styled from "styled-components";

export const Container = styled.div`
  .gain-section,
  .loss-section {
    display: grid;
    gap: 10px;
  }

  .gain-section {
    grid-template-columns: 1fr 1fr 2fr;
  }

  .loss-section {
    grid-template-columns: 1fr 2fr;
  }
`;
