import styled from "styled-components";

export const InformCustomerArrival = styled("div")`
  button {
    background-color: ${(props) => props.theme.green} !important;
    color: #fff !important;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    gap: 10px;
    
    svg {
        height: 17px;
        fill: #fff;
        width: auto;
    }
  }
`;
