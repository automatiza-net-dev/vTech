import styled from "styled-components";

export const SubgruposDetalhado = styled("div")`
  width: 100%;

  table {
    border-radius: 5px;
    width: 100%;
    overflow: hidden;
  }

  tr {
    background: #b9e2fd;
  }

  tbody {
    tr {
      &:nth-child(odd) {
        background-color: #36a2eb;

        * {
          color: #fff;
        }
      }
    }
  }

  td {
    padding: 10px 0;
    color: #2b2b2b;
    font-size: 12px;

    &:first-child {
      padding-left: 10px;
    }

    &:last-child {
      padding-right: 10px;
    }
  }

  tr + tr {
    border-top: 0.5px solid #fff;
  }

  thead {
    background: #b9e2fd;

    th {
      padding: 10px 0;
      font-weight: 700;
      font-size: 12px;
      color: #2b2b2b;
      text-transform: uppercase;

      &:first-child {
        padding-left: 10px;
      }

      &:last-child {
        padding-right: 10px;
      }
    }
  }
`;
