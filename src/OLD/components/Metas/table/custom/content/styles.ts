import styled from "styled-components";

export const ModalContent = styled("div")`
  h3 {
    text-align: center;
  }

  .input-manager-box {
    .list-input-manager {
      gap: 0;
    }

    .item {
      border: none;
      margin-bottom: 10px;

      > div:first-child {
        margin-bottom: -54px;
        width: 100%;
      }

      > div:last-child {
        padding: 0 40px 0 30px;
        display: flex !important;

        > div:last-child {
          width: fit-content;
        }
      }
    }
  }
`;
