import styled from "styled-components";

export const ProtocolForm = styled("div")`
  padding: 10px;
  min-width: 500px;
  section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .down-box {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }
  button {
    background-color: ${(props) => props.theme.primaryColor} !important;
  }
`;
