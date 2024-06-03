import styled from "styled-components";

export const Dashboard = styled("div")`
  display: flex;
  gap: clamp(10px, 1.56vw, 30px);

  .cards_skeleton {
    span {
      height: calc(100vh - 130px) !important;
    }
  }

  .skeleton {
    width: calc(100% - 260px);
    height: 50vh;

    span {
      height: 100vh !important;
    }
  }

  .charts {
    width: calc(100% - 260px);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    overflow: hidden;

    > div {
      border: 1px solid #e1e1e1;
      border-radius: 4px;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 10px;
    }
  }

  .cards {
    width: 13.54vw;
    max-width: 260px;
    min-width: 220px;
    margin: 0 0 0 auto;
  }

  table {
    th {
      padding-right: 10px;
    }

    .title_product {
      td {
        padding-bottom: 3px;
        font-weight: bold;
      }
    }

    .subitem_product + .title_product {
      td {
        padding-top: 15px;
      }
    }
  }

  @media only screen and (max-width: 1700px) {
    .charts {
      width: 100%;
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media only screen and (max-width: 1024px) {
    .charts {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;
