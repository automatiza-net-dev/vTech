import styled from "styled-components";

export const Goals = styled("div")`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  .item {
    width: 100%;
    background-color: #f1f1f1;
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 17px;
  }
`;
