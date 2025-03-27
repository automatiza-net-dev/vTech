import styled from "styled-components";

export const ServicesSelected = styled("div")`
  width: 100%;

  .top {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    background: #f7f7f7;
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
