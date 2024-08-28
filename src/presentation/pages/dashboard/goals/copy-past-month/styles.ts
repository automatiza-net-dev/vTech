import styled from "styled-components";

export const CopyPastMonth = styled.button`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  color: #000;
  width: fit-content;
  height: 30px;
  transition: all 0.2s;
  margin-bottom: 10px;
  position: relative;
  z-index: 22;
  font-size: 14px;

  svg {
    width: 100%;
    height: auto;
    fill: currentColor;
  }

  &:active {
    background: #ccc;
  }
`;

export const ConfirmModal = styled.div`
  padding: 20px;
  h4 {
    margin-bottom: 18px;
    font-size: 2rem;
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    button,
    a {
      height: 36px;
    }

    > div:first-child {
      button,
      a {
        background: #46aa2b;
      }
    }

    > div:last-child {
      button,
      a {
        background: #c11c1d;
      }
    }
  }
`;
