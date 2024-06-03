import styled from "styled-components";

export const SchedulesCarousel = styled("section")`
  width: 100%;

  h2 {
    margin-bottom: 10px;
    color: #2b2b2b;
    font-size: 24px;
    font-weight: 700;
    line-height: normal;
  }

  & + & {
    margin-top: 30px;
  }

  .slick-track {
    height: 100%;
    > div {
      height: 100%;
    }
    > div > div {
      margin-left: 10px;
    }
  }
`;
