import styled from "styled-components";

export const Breadcrumb = styled("div")`
    margin-bottom: 10px;
    
    a {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 5px;
        color: rgba(0, 0, 0, 0.6);

        svg {
            width: 15px;
        }
    }
`