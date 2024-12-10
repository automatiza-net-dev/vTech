import styled from "styled-components";

export const SelectBudgetClient = styled("div")`
  position: relative;
  z-index: 2;

  .checkbox-box {
    position: absolute;
    z-index: 1;
    top: -20px;
    right: 0;
    width: fit-content;
  }
`;
