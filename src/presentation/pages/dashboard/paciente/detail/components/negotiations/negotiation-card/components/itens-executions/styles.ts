import styled from "styled-components";

export const ItemsExecutions = styled.div`
  width: 100%;
  display: grid;
  align-items: center;
  gap: 30px;
  grid-template-columns: 300px max-content;

  & + & {
    margin-top: 10px;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;
