import styled from "styled-components";

export const Notifications = styled("div")`
    padding: 0 20px 30px;

    .logo {
        max-width: 200px;
        margin: 0 auto 20px;
        display: flex;
        text-align: center;
        justify-content: center;
        background-color: ${props => props.theme.primaryColor};
        padding: 10px;
    }
    
    .image {
        height: 40vh;
        max-width: 60vw;
        object-fit: contain;
    }

    h2 {
        font-size: 18px;
        margin-bottom: 5px;
        font-weight: bold;
    }

    p {
        margin: 0;
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