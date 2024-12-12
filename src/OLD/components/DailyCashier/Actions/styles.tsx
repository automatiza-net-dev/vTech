import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 40px;
  min-height: 40px;

  svg {
    min-width: 18px;
    height: auto;
  }

  .icon {
    cursor: pointer;
  }
`;
