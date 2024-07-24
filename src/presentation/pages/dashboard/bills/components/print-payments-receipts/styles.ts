import styled from "styled-components";

export const PrintPaymentReceipts = styled("div")`
  margin: 15px;
  .print-section {
    font-size: 20px;
    text-align: center;

    h2 {
      font-size: 23px;
      margin-top: 50px;
      margin-bottom: 30px;
    }

    .down-section {
      margin-top: 200px;
    }
  }

  table {
    width: 100%;
    margin-top: 20px;

    border-collapse: collapse;
  }

  thead {
    text-align: left;
  }

  tr {
    display: table-row;
    width: 100%;
  }

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    font-weight: bold;
  }

  td {
    text-align: left;
  }

  .localization {
    margin: 80px 0 60px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }
`;
