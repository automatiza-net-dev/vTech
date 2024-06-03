import styled from "styled-components";

export const BillSalesUserTable = styled("div")`
    padding-top: 25px;
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
