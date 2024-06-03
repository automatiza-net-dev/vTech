import { Typography } from "@mui/material";
import styled from "styled-components";

export const ToolTipContent = styled(Typography)`
  width: 100%;
  position: relative;
  color: #fff;
  padding: 10px 20px 10px 5px;

  .icon {
    width: 16px;
    height: 16px;
    display: flex;
    svg {
      width: 100%;
      height: auto;
      fill: currentColor;

      path {
        fill: currentColor;
      }
    }
  }

  .content {
    width: 100%;
    max-width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;

    > span {
      font-size: 12px;
      display: flex;
      word-break: break-all;
      line-height: 1.2;
    }
  }

  .content + .content {
    margin-top: 6px;
  }

  .content:nth-child(2) {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
`;
