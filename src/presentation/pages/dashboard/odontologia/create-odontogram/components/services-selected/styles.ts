import styled from "styled-components";

export const ServicesSelected = styled("div")`
  width: 100%;

  table tbody tr td {
    padding: 10px 15px 0 !important;
  }

  .top {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    background: rgb(196, 196, 196);
    align-items: center;
    padding: 10px;
    gap: 20px;

    button {
      background-color: transparent;
      border: 0;
      border: 0;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
