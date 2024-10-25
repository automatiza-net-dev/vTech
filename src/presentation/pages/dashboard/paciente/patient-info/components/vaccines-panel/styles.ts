import styled from "styled-components";

export const VaccinesPanel = styled("section")`
  .main-header,
  .main-content,
  .secondary-header,
  .secondary-content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  .main-header,
  .secondary-header {
    background-color: #cacaca;
  }

  .secondary-header,
  .secondary-content {
    margin-left: 20px;
  }

  .secondary-header {
    margin-top: 10px;
  }
`;