import styled from "styled-components";

export const ReactModal = styled("div")<{$disableOverflow?: boolean}>`
  overflow: unset;

  &.hasTitle {
    .head {
      width: 100%;
      display: flex;
      align-items: flex-start;
      padding: 10px 15px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.13);

      h3 {
        margin: 0;
        font-size: 16px;
      }

      .warning {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        margin-top: 5px;

        svg {
          width: 18px;
          height: auto;
          stroke: ${props => props.theme.red};
        }
      }
    }

    .closeModal {
      position: relative;
    }
  }

  .box-content {
    padding: 25px 15px;
    background-color: #fff;
    border-radius: 20px;
    position: relative;

    > div {
      box-shadow: unset;
    }
  }

  .box-white {
    width: 100%;
    max-height: 90vh;
    overflow-y: ${props => props.$disableOverflow ?  "unset" : "auto"};
    overflow-x: unset;
    padding-right: 10px;
  }

  .box-white::-webkit-scrollbar {
    width: 5px;
    border-radius: 0.52vw;
  }

  .box-white::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 0.52vw;
  }

  .box-white::-webkit-scrollbar-thumb {
    background: #000;
    border-radius: 0.52vw;
  }

  .closeModal {
    z-index: 5;
    background-color: transparent;
    border: 0;
    font-weight: 700;
    cursor: pointer;
    margin-left: auto;
    display: flex;
    top: 5px;
    right: 5px;
    position: absolute;

    svg {
      stroke: #000;
      transition: 0.3s;
    }
  }
`;
