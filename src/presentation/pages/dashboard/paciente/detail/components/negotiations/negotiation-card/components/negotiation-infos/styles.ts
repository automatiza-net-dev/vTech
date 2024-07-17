import styled from "styled-components";

export const NegotiationInfos = styled.div`
  h2,
  h3 {
    font-size: 17px;
    margin: 0;
  }

  h2 {
    font-weight: bold;
  }

  h3 {
    font-weight: 500;
  }

  svg {
    width: 16px;
    height: auto;
    stroke: #000;
    transition: rotate 0.2s;
    margin: 0 0 0 auto;
  }

  .top {
    display: flex;
    width: 100%;
    padding: 15px;
    cursor: pointer;
  }

  .main_content {
    max-height: 0;
    max-width: 0;
    opacity: 0;
  }
`;
