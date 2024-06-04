import styled from "styled-components";

export const TableChart = styled("div")`
  overflow: auto;
  height: 200px;

  table {
    width: 100%;
    * {
      font-size: 14px;
    }

    td:not(:nth-child(1)) {
      text-align: right;
      padding-right: 0 !important;
    }

    td:nth-child(2) {
      width: 55px;
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

  @media only screen and (max-width: 1600px) {
    height: 220px;

    table {
      * {
        font-size: 13px;
      }

      .name {
        > div {
          .color {
            width: 13px;
            height: 13px;
            margin-top: 3.5px;
          }

          span {
            width: calc(100% - 13px - 5px);
          }
        }
      }

      td {
        padding-right: 8px;
      }

      tr + tr {
        > td {
          padding-top: 9px;
        }
      }
    }
  }

  @media only screen and (max-width: 1400px) {
    height: 210px;

    table {
      * {
        font-size: 12px;
      }

      .name {
        > div {
          .color {
            width: 11px;
            height: 11px;
            margin-top: 3px;
            border-radius: 100%;
          }

          span {
            width: calc(100% - 11px - 5px);
          }
        }
      }

      td {
        padding-right: 7px;
      }

      tr + tr {
        > td {
          padding-top: 8px;
        }
      }
    }
  }
`;
