import styled from "styled-components";

export const Cards = styled("div")`
  .card-box {
    background-color: ${(props) => props.theme.primaryColor + "9e"};
    border-radius: 5px;
    margin-top: 10px;
    padding: clamp(10px, 0.78vw, 15px);
    line-height: 120%;
  }

  h3 {
    font-size: 18px;
    font-weight: 900;
  }

  h4 {
    margin-top: 3px;
    font-size: 16px;
    font-weight: 400;
  }

  @media only screen and (max-width: 1400px) {
    h3 {
      font-size: 16px;
    }

    h4 {
      font-size: 14px;
    }
  }

  @media only screen and (max-width: 1200px) {
  }

  @media only screen and (max-width: 1024px) {
    h3 {
      font-size: 15px;
    }

    h4 {
      font-size: 13px;
    }
  }

  @media only screen and (max-width: 900px) {
  }

  @media only screen and (max-width: 768px) {
  }

  @media only screen and (max-width: 600px) {
  }

  @media only screen and (max-width: 500px) {
  }

  @media only screen and (max-width: 420px) {
  }
`;
