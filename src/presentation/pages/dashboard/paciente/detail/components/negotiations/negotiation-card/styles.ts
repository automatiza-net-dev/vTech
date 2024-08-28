import styled from "styled-components";

export const NegotiationCard = styled("div")`
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primaryColor};
  overflow: hidden;
  display: block;

  .budgets {
    padding-left: 15px;
    margin-bottom: 15px;

    .budgets-list {
      > div {
        gap: 20px;
        width: 100%;
      }

      .content + .content {
        margin-top: 10px;
      }

      .box-check {
        margin: 0 0 0 auto;
      }
    }

    .budgets-list + .budgets-list {
      margin-top: 20px;
    }

    h3 {
      font-weight: bold;
      color: #000;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 3px;

      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;

        svg {
          height: 15px;
          width: auto;
          fill: ${(props) => props.theme.primaryColor};
        }
      }
    }

    h3,
    .content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      font-size: 15px;
    }

    h3 {
      div:first-child {
        display: flex;
        gap: 10px;
      }
    }

    .content {
      div:first-child {
        padding-left: 10px;
      }
    }

    .total {
      /* margin-top: 15px; */
      color: #000;
      font-weight: bold;
    }

    .form_budget {
      display: flex;
      align-items: center;
      gap: 15px;
    }
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;

    > div {
      display: flex;
      gap: 15px;
      width: calc(100% - 15px - 25px);
    }

    .checker {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      svg {
        height: 14px;
        width: auto;
      }
    }
  }

  &.open {
    .top {
      svg {
        rotate: 180deg;
      }
    }

    .main_content {
      max-height: 100%;
      max-width: 100%;
      opacity: 1;
      padding: 0 15px 15px;
    }
  }

  .list {
    margin-top: 40px;
    border-top: 1px solid #444;
    padding-top: 10px;

    .head {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      gap: 10px;

      .dados {
        margin-right: 3.75vw;
      }
    }

    .document + .document {
      margin-top: 5px !important;
    }
  }
`;
