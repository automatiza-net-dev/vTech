import styled from "styled-components";

export const Layout = styled("div")`
  .icon {
    display: flex !important;
  }

  .menu {
    &:not(.open) > ul > li > .link-menu > div {
      gap: 0;

      > span {
        display: none;
      }
    }

    > ul > li > ul > li > .link-menu > div {
      width: 100%;
    }
  }
`;
