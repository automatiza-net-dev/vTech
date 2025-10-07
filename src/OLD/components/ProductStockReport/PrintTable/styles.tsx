import styled from "styled-components";

export const Container = styled.div`

  .table-section {
    background-color: #ffffff;
  }

  .clinic-header {
    display: none;
  }

  .header-table {
    background-color: #a9a9a9;
    display: flex;
    justify-content: space-between;
    text-align: center;

    div {
      width: 20%;
    }
  }

  .table-box {
    height: 300px;
    overflow-y: scroll;
  }

  @media print {

    .table-section {
      margin-top: 5%;
    }

    .clinic-header {
      display: block;
    }

    .table-box {
      height: 100%;
      overflow-y: hidden;
    }

    .header-table {
      border-bottom: solid 1px;
    }

    @page {
      size: auto !important; /* auto is the initial value */

      /* this affects the margin in the printer settings */
    }

    /* reference: https://stackoverflow.com/questions/1542320/margin-while-printing-html-page */
  }
`;

export const RowBox = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;

  :nth-child(even) {
    background: #dcdcdc;
  }

  div {
    width: 20%;
  }

  @media print {
    border-bottom: dashed 0.5px;
  }
`;
