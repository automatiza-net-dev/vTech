import styled from "styled-components";

export const Cards = styled("div")`
  > div + div {
    margin-top: 15px;
    background-color: ${(props) => props.theme.primaryColor};
  }
`;
