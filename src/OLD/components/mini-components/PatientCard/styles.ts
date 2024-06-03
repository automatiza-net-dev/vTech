// @ts-nocheck
import styled, { css } from "styled-components";

export const Container = styled.div`
  ${({ color, host }) => css`
    display: flex;
    flex-direction: column;
    ${host === "LiftOne"
      ? `
        border: solid 2px #a0a0a0;
        background-color: #ffffff;`
      : `
        border: solid 2px ${color.dark};
        background-color: ${color.light};`}

    width: 240px;
    min-height: 120px;
    border-radius: 20px;
    padding: 15px;
    transition: all ease-in-out 0.25s;
    :hover {
      cursor: pointer;
      transform: scale(1.03);
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      h3 {
        margin: 0;
        font-size: 16px;
      }
      h6 {
        margin: 0;
        font-size: 12px;
      }
    }

    .patient-info {
      display: flex;
      flex-direction: column;
    }

    img {
      border-radius: 50%;
      border: solid 2px ${color.dark};
      width: 50px;
      height: 50px;
    }

    .tags-container {
      display: flex;
      font-size: 11px;
      gap: 6px;
      margin-top: 15px;
    }

    .note {
      text-align: center;
      font-size: 12px;
    }

    .footer {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
    }

    .level-emergency {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 15px;
      gap: 10px;
      border: 2px solid ${color.dark};
      border-radius: 5px;
      padding: 1px 10px;
      color: ${color.dark};

      svg {
        path {
          fill: ${color.dark};
        }
      }
    }
  `}
`;

export const Tag = styled.div`
  ${({ color }) => css`
    display: flex;
    border: 2px solid ${color.dark};
    color: ${color.dark};
    background-color: ${color.light};
    padding: 0px 2px;
    border-radius: 2px;
    :hover {
      cursor: pointer;
    }
  `}
`;

export const TagAdd = styled.div`
  border: 2px dashed #d9d9d9;
  padding: 0px 2px;
  color: black;
  :hover {
    border-color: #707070;
    cursor: pointer;
  }
`;
