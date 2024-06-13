import styled from "styled-components";

export const SalesPerPeriodTable = styled("div")`
  width: calc(60% - 372px);
  padding-top: 25px;
  margin: 5px;

  table {
    min-height: 250px;
    max-height: 250px;
  }

  h3 {
    margin-bottom: 0;
    font-size: 16px;
  }

  .head {
    font-weight: bold;
    margin-bottom: 6px;
    height: auto;
  }

  .controlled-height {
    height: auto;
  }

  .top-actions + div {
    border-width: 1px;
  }

  table {
    th {
      div {
        width: 100% !important;
        display: flex !important;
        justify-content: center !important;
      }
    }
    tbody {
      td:nth-child(even) {
        background: #f1f1f1 !important;
      }
      td:nth-child(odd) {
        background: #fff !important;
      }
      td {
        padding: 0px;
        text-align: center;
        font-size: 11px !important;
      }
    }
  }
`;
