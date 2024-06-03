import styled from "styled-components";

export const ToastItem = styled("div")`
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
  min-height: 64px;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  width: 270px;

  .toast-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    svg {
      width: 20px;
      margin-right: 10px;
    }

    span {
      color: #757575;
      width: calc(100% - 30px);
    }
  }

  .progressbar_container {
    height: 3px;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;

    .progressbar {
      height: inherit;
      background-color: #000;
    }
  }
`;
