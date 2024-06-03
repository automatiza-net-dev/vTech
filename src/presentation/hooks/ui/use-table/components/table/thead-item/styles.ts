import styled from "styled-components";

export const THeadItem = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 18px;
  margin: 0 auto;

  span {
    line-height: 10px;
    height: 12px;
    display: flex;
    cursor: pointer;
    margin-top: 3px;
    font-size: 13px;
  }

  .ord-actions {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 8px;
    gap: 3px;

    button:first-child {
      svg {
        transform: rotate(180deg) translateX(0);
      }
    }

    button {
      display: flex;
      background-color: transparent;
      padding: 0;
      border: 0;
      cursor: pointer;
      opacity: 0.5;
      height: 4px;
      align-items: center;

      svg {
        width: 6px;
        height: auto;
      }
    }

    button.active {
      opacity: 1;

      svg {
        fill: #000;
      }
    }
  }
`;
