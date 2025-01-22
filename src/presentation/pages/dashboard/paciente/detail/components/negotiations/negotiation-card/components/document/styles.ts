import styled from "styled-components";

export const Document = styled.div`
  font-size: 14px;
  color: #444;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  > div {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 20%;

    button {
      width: fit-content;
      height: 32px;
      padding: 0 10px;
      border: 1px solid #444;
      color: #444;
      background: #ff0000 !important;
      color: #ffff;
      border-color: #ff0000;

      &.printed {
        background: #25d366 !important;
        border-color: #25d366;
      }

      &:hover {
        color: #fff;
        border-color: ${(props) => props.theme.primaryColor};
        background: ${(props) => props.theme.primaryColor} !important;
      }

      svg {
        margin-right: 8px;
        stroke: currentColor;
      }
    }
  }
`;
