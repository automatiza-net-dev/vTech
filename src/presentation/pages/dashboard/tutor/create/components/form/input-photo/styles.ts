import styled from "styled-components";

export const ResultFileStyled = styled("div")`
  .image_box {
    width: 200px;
    height: 200px;
    overflow: hidden;
    position: relative;
    z-index: 22;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.2);

    img {
      width: 100%;
      object-fit: contain !important;
    }

    > svg {
      width: 34px;
      height: auto;
      position: absolute;
      z-index: 23;
      display: none;
    }

    &:before {
      background: rgba(0, 0, 0, 0.5);
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 22;
      transition: opacity 0.1s;
      opacity: 0;
    }

    &:hover {
      &:before {
        opacity: 1;
      }

      > svg {
        display: flex;
      }
    }
  }
`;
