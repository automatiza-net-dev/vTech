import styled from "styled-components";

export const Layout = styled("div")`
    ul {
        .item-title:hover {
    background-color: ${props => props.theme.primaryColor + "d1"};
    svg {
            fill: #fff !important;
        }
    &:hover >span {
    color: #fff;
    margin-right: 0;
    transition: 0.1s linear;
}
}

    li {
        svg {
            fill: ${props => props.theme.primaryColor} !important;
        }
    }

    li.active {
        background-color: ${props => props.theme.primaryColor};

        svg {
            fill: #fff !important;
        }
    }
    }
`