import { Style } from "@mui/icons-material";
import styled from "styled-components";

export const ButtonSetSchedulling = styled.div`
  width: 100%;
  max-width: 6.61vw;
  min-width: 110px;
  margin: 0 auto;

  button {
    width: 100%;
    border-radius: 100rem;
    padding: 0 20px;
    text-transform: uppercase;
    font-size: 14px;
    background-color: ${(props) => props.theme.primaryColor};
    box-shadow: none;
    height: 2.08vw;
    min-height: 36px;
  }
`;
