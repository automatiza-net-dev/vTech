import styled from "styled-components";

export const UserInfos = styled.div`
  border-bottom: 1px solid rgb(241, 241, 241);
  padding: var(--verticalSpacing) var(--horizontalSpacing);

  .top {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
    font-size: 14px;

    .contacts {
      color: #707070;

      > div {
        span {
          display: flex;
          align-items: center;
          gap: 8px;

          svg,
          i {
            width: 15px;
            height: auto;
            color: currentColor;
          }
        }
      }

      > div + div {
        margin-top: 2px;
      }
    }

    .avatar {
      color: #000;
      width: 70px;

      img {
        width: 100%;
        height: inherit;
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;

    button {
      color: #fff;
      height: 24px;
      border-radius: 2px;
      padding: 0 6px;
      font-size: 12px;
      margin: 0;

      i {
        width: 100%;
        height: auto;
        margin: 0 auto;
      }

      &.ficha {
        background: #808080;
      }

      &.contact {
        background: rgb(148, 0, 211);
      }

      &.add {
        background: rgb(255, 85, 0);
      }
    }
  }
`;
