import chroma from "chroma-js";
import styled from "styled-components";

export const TableLevels = styled("div")`
  width: 100%;
  padding-top: clamp(8px, 0.78vw, 15px);
  border-radius: 5px;
  background-color: ${(props) =>
    chroma(props.theme.primaryColor).alpha(0.2).hex()};

  h2 {
    font-size: 16px;
    color: #2b2b2b;
    border-bottom: 1px solid #000;
    padding-bottom: 5px;
    text-align: center;
    max-width: calc(100% - clamp(16px, 1.86vw, 30px));
    margin: 0 auto 10px;
    font-weight: 600;
    text-transform: uppercase;
  }

  table {
    width: 100%;

    th:not(:nth-child(1)),
    td:not(:nth-child(1)) {
      text-align: center;
    }

    thead {
      font-size: 12px;
      font-weight: bold;
      color: #2b2b2b;

      th {
        padding-bottom: 10px;
        padding-right: 0 !important;
        text-transform: uppercase;
      }

      th:nth-child(1) {
        width: 180px;
      }

      th:nth-child(2) {
        width: 50px;
      }

      th:nth-child(3) {
        width: 100px;
      }

      th:nth-child(4) {
        width: 50px;
      }
    }

    th:first-child,
    td:first-child {
      padding-left: 15px;
    }

    th:last-child,
    td:last-child {
      padding-right: 5px;
    }

    tbody {
      tr.primary {
        height: 34px;
        padding: 0 15px;
        background-color: ${(props) =>
          chroma(props.theme.primaryColor).alpha(0.7).hex()};
        color: #fff;
      }

      tr.second {
        background-color: ${(props) =>
          chroma(props.theme.primaryColor).alpha(0.25).hex()};
      }

      tr.third {
        background-color: ${(props) =>
          chroma(props.theme.primaryColor).alpha(0.1).hex()};
      }

      tr.second,
      tr.third {
        td {
          padding: 8px 0;
          color: #2b2b2b;

          span {
            color: inherit;
            font-weight: 500;
          }
        }

        td:nth-child(1) {
          padding-left: 18px;

          > span {
            position: relative;
            line-height: 1.2;
            display: flex;

            &::after {
              content: "";
              width: 2px;
              background-color: ${(props) =>
                chroma(props.theme.primaryColor).alpha(0.7).hex()};
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: -8px;
              height: 100%;
            }
          }
        }
      }

      tr.second + tr.second,
      tr.third + tr.third {
        border-top: 1px solid #fff;
      }

      td {
        font-size: 12px;
      }
    }
  }

  @media only screen and (max-width: 1450px) {
    h2 {
      font-size: 14px;
      padding-bottom: 4px;
      margin: 0 auto 8px;
    }

    table {
      thead {
        font-size: 11px;

        th {
          padding-bottom: 9px;
        }

        th:nth-child(1) {
          width: 180px;
        }

        th:nth-child(2) {
          width: 50px;
        }

        th:nth-child(3) {
          width: 100px;
        }

        th:nth-child(4) {
          width: 50px;
        }
      }

      th:first-child,
      td:first-child {
        padding-left: 13px;
      }

      th:last-child,
      td:last-child {
        padding-right: 5px;
        text-align: right;
      }

      tbody {
        tr.primary {
          height: 32px;
          padding: 0 13px;
        }

        tr.second,
        tr.third {
          td {
            padding: 7px 0;
          }

          td:nth-child(1) {
            padding-left: 16px;
          }
        }

        td {
          font-size: 11px;
        }
      }
    }
  }
`;
