import styled from "styled-components";

export const Container = styled.div`
  background: #fff;
  border: 1px solid #e6e8eb;
  border-radius: 12px;
  padding: 20px 24px 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  margin-bottom: 16px;

  .daterange-box {
    * {
      font-size: 13px !important;
    }
    .input-icon {
      width: 14px;
    }

    .spacing-text {
      margin: 0px 5px;
    }

    input {
      width: 100%;
      padding-left: 30px !important;
    }
  }

  .conntent_form_infinity_forge {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 4px;

    .list-radios {
      display: flex;
      align-items: center;
      gap: 10px;

      label {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
      }

      input {
        width: 16px;
        height: 16px;
        cursor: unset;
      }
    }

    .box {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 16px 20px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      > * {
        flex: 1 1 170px;
        min-width: 160px;
      }

      &.main {
        flex-wrap: nowrap;
        gap: 10px;

        > * {
          flex: 1 1 110px;
          min-width: 90px;
        }
      }
    }
  }

  .ant-collapse {
    border: none;
    background: transparent;
    margin-top: 8px;

    .ant-collapse-item {
      border: none;
      border-top: 1px solid #f0f1f3;
    }

    .ant-collapse-header {
      padding: 14px 0 !important;
      font-weight: 600;
      font-size: 14px;
      color: var(--primary, #0f766e);

      .ant-collapse-arrow {
        color: var(--primary, #0f766e);
      }
    }

    .ant-collapse-content-box {
      padding: 4px 0 8px !important;
    }
  }
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
`;
