import styled from "styled-components";

export const Image = styled("div")`
  height: 100%;
  min-height: inherit;
  max-height: inherit;
  width: inherit;
  min-width: inherit;
  max-width: inherit;
  aspect-ratio: inherit;
  position: relative;

  &.loading {
    background-color: ${(props) => props.theme.secondaryColor + "8a"};
    background: linear-gradient(
        100deg,
        rgba(255, 255, 255, 0) 40%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 60%
      )
      ${(props) => props.theme.secondaryColor + "8a"};
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: 1s loading ease-in-out infinite;

    > img {
      opacity: 0;
    }
  }

  @keyframes loading {
    to {
      background-position-x: -20%;
    }
  }

  img {
    width: 100% !important;
    position: relative !important;
    height: inherit !important;
    position: relative !important;
    min-height: inherit !important;
    max-height: inherit !important;
    min-width: inherit !important;
    max-width: inherit !important;
    object-fit: cover !important;
    object-position: center center !important;
    aspect-ratio: inherit;
  }
`;
