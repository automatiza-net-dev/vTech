import styled from "styled-components";

export const TableChart = styled("div")`
  overflow: auto;
  height: 200px;
  
  table {
    width: 100%;
    * {
      font-size: 14px;
    }

    .name {
      width: 144px;
      font-weight: 700;

      > div {
        display: flex;
        align-items: flex-start;
        gap: 5px;

        .color {
          width: 14px;
          height: 14px;
          margin-top: 4px;
        }

        span {
          width: calc(100% - 14px - 5px);
        }
      }
    }

    .percent {
      width: 40px;
    }

    .value {
      width: 120px;
    }

    td {
      vertical-align: baseline;
      padding-right: 10px;
    }

    tr + tr {
      > td {
        padding-top: 10px;
      }
    }

    td:last-child {
      text-align: right;
    }
  }
`;
