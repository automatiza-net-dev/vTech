import styled from "styled-components";

export const Container = styled.section`
  .custom-card {
    text-align: left;
    margin-top: 10px;
    cursor: pointer;
    :hover {
      border: 1px dashed var(--gray);
      border-radius: 5px;
    }
  }

  .custom-add-budget {
    padding: 5px;
    cursor: pointer;
    margin-top: 5px;
    border: 1px dashed var(--gray);
    width: 100%;
    border-radius: 5px;
    :hover {
      background-color: var(--blue);
    }
  }
`;
