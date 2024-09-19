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

  .navigation {
    display: flex;
    justify-content: center;
    gap: 20px;
    width: 100%;
    margin-top: 15px;

    button {
      background-color: transparent;
      border: 0;
      padding: 0;

      svg {
        height: 20px;
        width: auto;
      }
    }
  }

  & + & {
    margin-top: 30px;
  }
`;
