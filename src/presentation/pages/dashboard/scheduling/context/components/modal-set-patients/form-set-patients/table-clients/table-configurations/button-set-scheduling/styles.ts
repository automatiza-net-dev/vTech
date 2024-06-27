import { Style } from "@mui/icons-material";
import styled from "styled-components";

export const ButtonSetSchedulling = styled.div`
  width: 100%;
  margin: 0 auto;

  button {
    width: 100%;
    padding: 0 15px;
    text-transform: uppercase;
    font-size: 13px;
    background-color: #2ca5a5;
    box-shadow: none;
    height: 30px;

    &:disabled {
      background-color: #dddcdc !important;
      color: #fff !important;
    }
  }
`;
