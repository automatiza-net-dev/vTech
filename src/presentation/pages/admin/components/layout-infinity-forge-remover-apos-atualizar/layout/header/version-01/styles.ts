import styled from 'styled-components'

export interface IStyledHeaderProps {
  $hasSidebarButton?: boolean
}

export const HeaderVersion01 = styled.header<IStyledHeaderProps>`
  width: 100%;
  z-index: 6;
  top: 0;
  background: ${(props) => props.theme.primaryColor};
  padding: 10px 0;
  backdrop-filter: blur(20px);
  transition: box-shadow 0.2s ease-in-out;

  ${(props) =>
    props.$hasSidebarButton &&
    `
   .container {
    .left {
      width: fit-content !important;
    }

    .right {
      padding-left: 0 !important;
    }
  }
  `}

  .logo-wrapper {
    max-width: 285px;
  }

  .logo {
    display: flex;
    width: 100%;
    max-width: 160px;

    img {
      object-fit: contain;
      width: 100%;
      height: inherit;
    }
  }

  .container {
    display: flex;
    gap: 15px;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      width: 100%;
      max-width: 285px;
      width: 285px;
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: clamp(5px, 0.78vw, 15px);
      padding-left: 20px;
    }
  }

  button.open_menu {
    padding: 0;
    border: none;
    background: none;
    display: flex;
    height: 24px;
    width: 24px;

    svg {
      width: 100%;
      height: auto;
      stroke: #fff;
    }
  }

  @media only screen and (max-width: 1700px) {
    .logo-wrapper,
    .container.left {
      max-width: 280px;
    }
  }

  @media only screen and (max-width: 1650px) {
    .logo-wrapper,
    .container.left {
      max-width: 275px;
    }
  }

  @media only screen and (max-width: 1600px) {
    .logo-wrapper,
    .container.left {
      max-width: 270px;
    }
  }

  @media only screen and (max-width: 1550px) {
    .logo-wrapper,
    .container.left {
      max-width: 265px;
    }
  }

  @media only screen and (max-width: 1500px) {
    .logo-wrapper,
    .container.left {
      max-width: 260px;
    }
  }

  @media only screen and (max-width: 1450px) {
    .logo-wrapper,
    .container.left {
      max-width: 255px;
    }
  }

  @media only screen and (max-width: 1400px) {
    .logo-wrapper,
    .container.left {
      max-width: 250px;
    }
  }

  @media only screen and (max-width: 1350px) {
    .logo-wrapper,
    .container.left {
      max-width: 245px;
    }
  }

  @media only screen and (max-width: 1200px) {
    .logo-wrapper,
    .container.left {
      max-width: 240px;
    }
  }

  @media only screen and (max-width: 1280px) {
    .logo-wrapper {
      max-width: fit-content;
    }
  }

  @media only screen and (max-width: 1024px) {
    .left {
      width: 110px !important;
    }
  }
`
