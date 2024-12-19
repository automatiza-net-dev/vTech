import styled from "styled-components";

export const ConfirmDelete = styled("div")`
  padding: 0 20px 20px;

  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;

    > div:first-child {
      button {
        background: #e62634;
        color: #fff;
      }
    }

    > div:last-child {
      button {
      }
    }
  }
`;
