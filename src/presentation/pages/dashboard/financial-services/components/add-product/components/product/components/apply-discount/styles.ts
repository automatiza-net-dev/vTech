import styled from "styled-components"


export const ApplyDiscount = styled("div")`
display: flex;
align-items: center;
justify-content: flex-start;
width: 100%;
padding: 10px;

    .input_control {
        margin-bottom: 0 !important;
    }

    h3 {
        margin-bottom: 0 !important;
        min-width: 200px;
    }

    .input_control {
        width: fit-content !important;
    }

    .list-radios {
        display: flex;
        gap: 30px;
        align-items: center;
        width: 300px;

        label {
            align-items: center;
            display: flex !important;
            gap: 5px;
            font-size: 12px;
            margin-bottom: 0;
        }

        input {
            width: 14px !important; 
            min-width: 14px !important;
            height: unset !important;
        }
    }

    .row {
        width: 100%;
        align-items: center;
    }
`