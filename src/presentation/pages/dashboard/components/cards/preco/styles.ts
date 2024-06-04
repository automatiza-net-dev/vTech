import styled from "styled-components";

import chroma from "chroma-js";

export const PrecoCard = styled("div")`
  border-radius: 5px;
  width: 100%;
  background-color: ${(props) =>
    chroma(props.theme.primaryColor).alpha(0.2).hex()};
  min-height: 76px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 6px 15px;

  h3 {
    margin-bottom: 0;
    font-size: 18px;
    font-weight: 700;
    color: ${(props) => props.theme.primaryColor};
  }

  p {
    font-size: 16px;
    margin-bottom: 0;
    color: #2b2b2b;
  }

  @media only screen and (max-width: 1600px) {
    h3 {
      font-size: 17px;
    }

    p {
      font-size: 15px;
    }
  }

  @media only screen and (max-width: 1400px) {
    h3 {
      font-size: 16px;
    }

    p {
      font-size: 14px;
    }
  }
`;
