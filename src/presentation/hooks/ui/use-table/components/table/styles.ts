import styled from "styled-components";

interface ITableStyleProps {
  $tableFullWidth: boolean;
  $widthHeader: number;
}

export const Table = styled("div")<ITableStyleProps>`
  overflow-x: hidden;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid rgba(224, 224, 224, 1);
  border-left: 1px solid rgba(224, 224, 224, 1);
  border-right: 1px solid rgba(224, 224, 224, 1);

  > div {
    width: ${(props) =>
      props.$tableFullWidth
        ? "100%"
        : `calc(100vw - 30px - 30px - ${props.$widthHeader}px - 25px)`};
    overflow-x: auto;
  }

  > .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }

  table {
    width: 100%;

    > div {
      width: 100%;
    }

    thead {
      background-color: #f1f1f1;

      th {
        vertical-align: inherit;
        border-bottom: 1px solid rgba(224, 224, 224, 1);
        padding: 12px;
        color: rgba(0, 0, 0, 0.87);
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 2;
        text-align: center;
      }
    }

    tbody {
      display: table-row-group;

      tr {
        height: 58px;
      }

      td {
        border-bottom: 1px solid rgba(224, 224, 224, 1);
        padding: 4px;
        color: rgba(0, 0, 0, 0.87);
        text-align: center;
        font-size: 13px;
      }
    }
  }
`;
