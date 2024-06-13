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
    margin-left: -5px;

    > div {
      height: 100%;
      max-width: 90%;
    }
    > div > div {
      & + & {
        margin-left: 10px;
      }
    }
  }

  .slick-arrow {
    &:before {
      color: #444;
      opacity: 1;
    }
  }

  .slick-track {
    > div:first-child {
      margin-left: 0;
    }
  }

  .slick-slider {
    .slick-arrow {
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 100%;
      padding: 8px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0;
      top: unset;
      bottom: -40px;
      left: 50%;

      &.slick-disabled {
        opacity: 0.25;
      }

      &.slick-prev {
        left: 48%;
      }

      &.slick-next {
        left: 52%;
      }

      &:before {
        content: "";
        display: none;
      }
    }

    > svg {
      width: 100%;
      height: auto;
      fill: #444;
    }
  }
`;
