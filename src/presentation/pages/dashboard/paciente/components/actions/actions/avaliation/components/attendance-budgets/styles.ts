import styled from "styled-components";

export const AttendanceBudgets = styled("div")`
    padding-top: 25px;

    h3 {
        text-align: center;
        margin-bottom: 10px;
    }

    .budget {
        border: 1px solid #000;
        padding: 10px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .list-budgets {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
    }

`