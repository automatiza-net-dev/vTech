import styled from "styled-components";

export const ReportDRE = styled("div")`

  .font_title {
    position: absolute;
    top: -47px;
    text-align: center;
    width: 100%;
    font-weight: bold;
    font-size: 16px;
    margin: 0;
    padding: 10px;
    background: #000;
    color: #fff;
  }

  input {
    height: 24px;
  }

  .description {
    width: 300px;
    margin-right: 60px;
  }

  .group {
    .group_top {
      display: flex;
      align-items: center;
      background-color: #7F7F7F;
      justify-content: flex-start;
      padding: 1px 5px;
    }

    .input_control {
      margin-bottom: 0;
    }

    span {
      color: #000;
    }

    .group_values {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid #000;

      span {
        width: 120px;
      }
    }

    input {
      width: 120px;
    }

    > .group {
      .group_top {
        background-color: #C3C3C3 !important;
      }

      > .group {
        .group_top {
          background-color: #FFFFFF !important;
        }
      }
    }
  }

  .form-button.sticky button{
    width: fit-content;
    height: 40px;
    padding: 0 40px;
    font-size: 14px;
    transition: 0.3s;

    border-radius: 5px;
    border: none;
    color: #fff;
    font-size: 14px;
    display: flex
;
    align-items: center;
    justify-content: center;
}

.cancel {
  background-color: red !important;

}
`;
