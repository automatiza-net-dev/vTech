import styled from "styled-components";

export const ServicesSelected = styled("div")`
  width: 100%;

  table tbody tr td {
    thead {
      height: 40px;

      tr {
        height: 40px;
      }

      * {
        font-size: 11px !important;
      }
    }

    tbody {
      td {
        padding-top: 10px;
      }
    }

    table:before {
      border-radius: 2px;
    }
  }

  .error_table {
    min-height: 100px;
    padding-top: 20px;
  }

  .action-button {
    border: 0;
    padding: 0;
    background: #e1e1e1;
    color: #828282;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    padding: 8px;
    cursor: pointer;
    button {
      background-color: transparent;
      border: 0;
      padding: 0;
      width: 100%;
      color: currentColor;
    }

    svg {
      width: 100%;
      height: auto;
      fill: currentColor;
    }
  }

  thead {
    * {
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }

  .top {
    display: flex;
    width: 100%;
    justify-content: space-between;
    background: rgb(196, 196, 196);
    align-items: center;
    padding: 10px;
    gap: 20px;
    margin-bottom: 10px;

    .services_informations {
      display: flex;
      align-items: center;
      gap: 20px;

      * {
        margin-bottom: 0;
        color: #000;
      }
    }

    button {
      background-color: transparent;
      border: 0;
      border: 0;
      color: #000;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
