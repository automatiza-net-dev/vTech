import styled from "styled-components";

interface IStyledDashboard {
  $breakColumns?: boolean;
}

export const Dashboard = styled("div")<IStyledDashboard>`
  --cardsWidth: ${(props) => (props.$breakColumns ? "435px" : "372px")};

  .sales_period_table {
    width: calc(50% - var(--cardsWidth)) !important;
  }

  .sales_by_user_table {
    width: calc(65% - var(--cardsWidth)) !important;
  }

  .general-dashboard {
    display: flex;
    gap: 15px;

    .cards_skeleton {
      span {
        height: calc(100vh - 130px) !important;
      }
    }

    .skeleton {
      width: calc(100% - var(--cardsWidth));
      height: 50vh;

      span {
        height: 100vh !important;
      }
    }

    .charts {
      width: calc(100% - var(--cardsWidth));

      > div {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        overflow: hidden;

        .custom-table {
          grid-column: 2 / 4;
        }

        > div {
          border: 1px solid #e1e1e1;
          border-radius: 4px;
          display: flex;
          align-items: center;
          flex-direction: column;
          padding: 10px;
          width: ${(props) =>
            props.$breakColumns
              ? "calc(50% - 3.4px)"
              : "calc(33.33333333% - 3.4px)"};
        }
      }
    }

    .cards {
      width: var(--cardsWidth);
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

    @media only screen and (max-width: 1650px) {
      .charts {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media only screen and (max-width: 1600px) {
      --cardsWidth: ${(props) => (props.$breakColumns ? "390px" : "372px")};
    }

    @media only screen and (max-width: 1400px) {
      --cardsWidth: ${(props) => (props.$breakColumns ? "370px" : "372px")};
    }

    @media only screen and (max-width: 1024px) {
      .charts {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }

  .tables-section {
    .row {
      > div {
        width: 100% !important;
        margin: 0;

        > h3 {
          margin-bottom: 0 !important;
        }
      }
    }
  }
`;
