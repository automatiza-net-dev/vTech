import styled from "styled-components";

export const SideBarContent = styled.div`
  --verticalSpacing: 16px;
  --horizontalSpacing: 24px;

  width: 100%;
  height: 100%;
  overflow-y: auto;

  .reset-button {
    padding: 0;
    border: 0;
    background: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  span {
    display: block;
  }

  .head,
  .status {
    width: 100%;
    padding: var(--verticalSpacing) var(--horizontalSpacing);
    border-bottom: 1px solid rgb(241, 241, 241);
    color: #999999;
  }

  .head {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 16px;

    .close {
      width: 16px;
      height: 16px;
      display: flex;
      color: currentColor;
      margin: 0;
    }
  }

  .status {
    text-align: center;
    font-size: 14px;
  }

  .tab {
    padding: var(--verticalSpacing) var(--horizontalSpacing);

    .menu {
      a {
        color: #1890ff !important;
        font-size: 14px !important;
      }

      a.active {
        border-color: currentColor !important;
      }
    }

    .tab {
      box-shadow: none;
      padding: 0;
      border: 0;

      a {
        font-size: 14px !important;
      }

      button {
        height: 32px;
        padding: 0 7px;
        border-radius: 2px;
        color: #000;
        background: #d3d3d3;
      }
    }
  }

  .schedule-title {
    margin-bottom: 20px;
  }

  .schedule-content {
    text-align: start;
    display: flex;
    flex-direction: column;
    gap: 4px;

    p {
      margin: 0;
    }
  }

  .schedule-content + .schedule-content {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  .reset-button {
    margin: 12px auto 0;
  }
`;
