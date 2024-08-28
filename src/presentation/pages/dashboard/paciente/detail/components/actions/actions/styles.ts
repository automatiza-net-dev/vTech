import styled from "styled-components";

export const Actions = styled("div")`
  z-index: 10;
  position: relative;

  .hover_container {
    position: relative;
    .sub_menu {
      display: none;
      top: 40px;
      left: 0;
      width: 100%;
      position: absolute;
    }

    &:hover {
      .sub_menu {
        display: block;
        border: 1px solid ${(props) => props.theme.primaryColor};
        width: 100%;

        button {
          width: 100%;
          background-color: #fff;
          border: 0 !important;
          border-radius: 0;
          box-shadow: unset;
          color: ${(props) => props.theme.primaryColor};
          justify-content: flex-start;
          padding: 0 10px;

          svg {
            fill: ${(props) => props.theme.primaryColor};
          }

          &:hover {
            background-color: #f2f2f2 !important;
          }
        }
      }
    }
  }
`;
