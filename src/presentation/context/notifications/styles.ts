import styled from "styled-components";

export const Notifications = styled("div")`
    padding: 30px;
    
    img {
        height: 40vh;
        max-width: 60vw;
        object-fit: contain;
    }

    h2 {
        font-size: 18px;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .message {
        margin-bottom: 25px;
    }

    .actions {
        display: flex;
        gap: 15px; 
        justify-content: center;
    }
`