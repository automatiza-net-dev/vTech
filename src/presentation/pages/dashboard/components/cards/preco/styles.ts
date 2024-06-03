import styled from "styled-components";

export const PrecoCard = styled("div")`
  border-radius: 5px;
  background: #dfeffa;
  color: #2b2b2b;
  padding: clamp(8px, 0.78vw, 15px);
  width: 100%;

  h3 {
    margin-bottom: 5px;
    font-size: 18px;
  }

  p {
    font-size: 16px;
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
