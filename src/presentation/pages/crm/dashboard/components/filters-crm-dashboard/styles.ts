import styled from "styled-components";

export const FiltersCrm = styled("div")`
  .date_picker_container {
    background-color: ${(props) => props.theme.primaryColor};
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
