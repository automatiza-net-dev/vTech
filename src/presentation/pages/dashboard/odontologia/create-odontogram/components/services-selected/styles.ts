import styled from "styled-components";

export const ServicesSelected = styled("div")`
  width: 100%;

  table tbody tr td {
    padding: 5px 15px 0 !important;

    td {
      padding: 10px 15px 0 !important;
    }
  }

  thead {
    display: none !important;
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
