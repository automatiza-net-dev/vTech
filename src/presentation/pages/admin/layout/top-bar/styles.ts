import styled from "styled-components";

export const TopBar = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  width: 100%;

  a {
    padding: 20px;
  }

  .appBar {
    border-bottom: 1px solid #e5e9f2;
    box-shadow: 0 1px 3px 0 rgba(54, 74, 99, 0.05);

    .userName {
      flex-grow: 1;

      span {
        font-size: 20px;
        font-weight: 500;
        margin-left: 15px;
      }
    }

    .buttonIcon {
      width: 70px;

      .badge {
        span {
          padding: 0px 5px;
          height: 20px;
          border-radius: 50%;
          top: 10px;
          right: 15px;
        }
      }
    }
  }

  .itemMenuBar {
    display: flex;
    min-width: 200px !important;
  }
`;
