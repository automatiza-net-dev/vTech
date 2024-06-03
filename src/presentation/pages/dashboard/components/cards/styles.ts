import styled from "styled-components";

export const Cards = styled("div")`
  .card-box {
    background-color: #b9e2fd;
    border: 1px solid #000;
    border-radius: 5px;
    margin-top: 10px;

    h3 {
      font-size: 15px !important;
    }

    .item-description {
      text-align: right !important;
      font-size: 12px;
    }

    .first-section,
    .card-header,
    .second-section,
    .third-section {
      display: grid;
      gap: 2px;
      grid-template-columns: 3fr 2fr 1fr;
    }

    .card-header,
    .card-header-sugroup {
      background-color: #b9e2fd;
      padding: 10px;
    }

    .first-section {
      background-color: #36a2eb;
      color: #fff;
      padding: 10px;
    }

    .second-section {
      background-color: #b9e2fd;
      padding: 10px;
    }

    .third-section {
      font-style: italic;
      background-color: #dfeffa;
      padding: 10px;
    }
  }

  .card-header-sugroup,
  .first-section-subgroup,
  .second-section-sugroup {
    display: grid;
    gap: 2px;
    grid-template-columns: 4fr 3fr 2fr 1fr;
  }

  .first-section-subgroup {
    background-color: #36a2eb;
    color: #fff;
    padding: 10px;
  }

  .second-section-sugroup {
    background-color: #b9e2fd;
    padding: 10px;
  }

  .text-right {
    text-align: right;
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
