import styled from "styled-components";

export const Container = styled.div`
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
`;
