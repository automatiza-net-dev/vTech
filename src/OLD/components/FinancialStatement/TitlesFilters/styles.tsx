import styled from "styled-components";

export const Container = styled.div`
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
    width: 100%;
    gap: 20px;

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

    > .box {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      > .box {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }
`;

export const InputBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #fff;
  border-radius: 40px;
  padding: 0 10px;

  .date-component {
    div {
      width: 100%;
    }
    input {
      font-size: 14px;
      width: 220px;
    }
  }

  input,
  .date-component,
  .select-component {
    border: none;
    width: 100%;
  }

  .custom-input {
    border: 1px solid var(--cinza-200, #e1e1e1);
  }
`;
