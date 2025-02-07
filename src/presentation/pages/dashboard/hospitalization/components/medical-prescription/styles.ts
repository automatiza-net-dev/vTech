import styled from "styled-components";

export const MedicalPrescription = styled("div")`
    .row {
        display: flex;
        justify-content: space-between;
        
        > * {
            width: 100%;
        }
    }

    .row + .row {
        margin-top: 10px;
    }

    .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;

        .box-right {
            display: flex;
            gap: 20px;

            > * {
                width: 200px;
                 > * {
                    width: 100%;

                    > * {
                        width: 100%;
                    }
                 }
            }
        }
    }
`