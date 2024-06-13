import styled from "styled-components";

export const FormSetClients = styled("div")`
  width: 100%;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    h2 {
      font-size: 17px;
      text-transform: uppercase;
    }
  }

  h3 {
    margin-bottom: 2px;
    color: #666;
    font-size: 14px;
    font-weight: 400;
  }

  .row-title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 2px;
    display: flex;
    gap: 5px;

    svg {
      width: 15px;
      height: auto;
    }

    span {
      display: flex;
    }
  }

  .row {
    &.first {
      margin-bottom: clamp(0px, 0.52vw, 10px);
    }
  }

  form {
    button {
      width: 100%;
    }

    .form-button {
      margin-left: auto;
      display: flex;
      gap: 10px;

      button {
        max-width: 150px;
      }
    }
  }

  .table-box {
    overflow-x: auto;
    width: 100%;
    max-width: 100%;

    h2 {
      font-size: 14px;
      font-weight: 400;
    }

    .table {
      td {
        vertical-align: center !important;
      }

      > div {
        min-width: 830px;
        overflow-x: auto;
        min-height: 390px;

        > div {
          width: 100%;
        }
      }
    }
  }

  @media only screen and (max-width: 620px) {
    .row {
      flex-direction: column;
      gap: 0;

      &.first {
        margin-bottom: 0;
      }
    }
  }
`;
