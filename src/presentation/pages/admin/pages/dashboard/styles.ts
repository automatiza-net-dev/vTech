import styled from "styled-components";

export const DashboardAdmin = styled("div")`
  .clinicas {
    width: 300px;
    height: 40px;

    > div {
      width: 100%;
      height: inherit;

      > div {
        height: inherit;
      }
    }
  }

  .top {
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }

  .form {
    width: calc(100% - 400px);
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 7px 23px 0px rgba(0, 0, 0, 0.16);

    div {
      > form {
        display: flex !important;
        gap: 25px;

        .row {
          align-items: center;

          > div {
            margin: 0;
          }

          input {
            margin: 0;
          }
        }
      }
    }
  }

  .charts-box {
    margin-top: 20px;

    > div {
      width: 100%;
    }
  }
`;
