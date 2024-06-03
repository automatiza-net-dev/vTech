import styled from "styled-components";

export const InputAddUnit = styled("div")`
    .select-unit-container {
        display: flex;
        gap: 10px;
        width: 100%;

        button {
            margin-top: 30px;
            height: 34px;
            width: 34px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 100%;
            border: 0;
            background-color: ${props => props.theme.primaryColor};

            svg {
                color: #fff;
            }
        }

        button.disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }

`