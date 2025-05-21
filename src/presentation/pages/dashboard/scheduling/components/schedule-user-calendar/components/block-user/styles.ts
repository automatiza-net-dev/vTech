import styled from "styled-components"

export const BlockUser = styled("div")`
    button {
        border-radius: 100%;
        height: 35px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0;
        background-color: ${props => props.theme.primaryColor};
    }
    svg {
        width: 22px;
        stroke: #fff;
        height: auto;
    }
`