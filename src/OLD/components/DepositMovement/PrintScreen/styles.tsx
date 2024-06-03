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
      width: 12%;
    }

    .small-width {
      width: 7%;
    }

    .observation-field {
      margin-left: 2%;
      width: 25%;
    }
  }

  .table-box {
    height: 300px;
    overflow-y: scroll;
  }

  @media print {
    margin: 15px;
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

    footer {
      width: 100%;
      position: absolute;
      top: 97%;
      text-align: right;
    }

    /* reference: https://stackoverflow.com/questions/1542320/margin-while-printing-html-page */

    @page {
      size: auto;
    }
  }
`;

export const RowBox = styled.div`
  .small-width {
    width: 7% !important;
  }

  :nth-child(even) {
    background: #dcdcdc;
  }

  .content-table {
    display: flex;
    justify-content: space-between;
    text-align: center;
    div {
      width: 12%;
    }
    .observation-field {
      margin-left: 2%;
      width: 25%;
      font-size: 0.8em;
      text-align: left;
    }
  }

  @media print {
    border-bottom: dashed 0.5px;
  }
`;
