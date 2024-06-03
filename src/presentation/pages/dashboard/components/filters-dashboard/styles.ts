import styled from "styled-components";

export const FiltersDashboard = styled("div")`
  .date_picker_container {
    background-color: #36a2eb;
    height: 2.81vw;
    max-height: 54px;
    min-height: 48px;
    display: flex;
    align-items: center;
    padding: 0 clamp(10px, 1.04vw, 20px);

    svg {
      left: clamp(10px, 1.04vw, 20px);
    }
  }
`;
