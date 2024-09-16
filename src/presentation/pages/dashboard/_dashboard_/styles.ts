import styled from "styled-components";

export interface IStyledDashboard {
  $breakColumns?: boolean;
  $gridStyle?: "grid-3" | "";
}

export const Dashboard = styled("div")<IStyledDashboard>`
  --cardsWidth: ${(props) => (props.$breakColumns ? "435px" : "372px")};

  .sales_period_table {
    width: calc(50% - var(--cardsWidth)) !important;
  }

  .sales_by_user_table {
    width: calc(65% - var(--cardsWidth)) !important;
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
