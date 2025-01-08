import styled from "styled-components";

export const Actions = styled.div`
  padding: var(--verticalSpacing) var(--horizontalSpacing);
  font-size: 14px;

  .actions-infos {
    margin-bottom: 20px;

    > span {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #000;

      svg {
        width: 15px;
        height: auto;
      }
    }

    > span + span {
      margin-top: 4px;
    }
  }

  .canceled-box {
    > strong {
      margin-bottom: 12px !important;
      display: flex;
    }

    p {
      margin: 0;
    }

    p + p {
      margin-top: 5px;
    }
  }

  .buttons-box {
    width: 100%;
    font-size: 12px;

    > * + * {
      margin-top: 4px;
    }

    .row {
      align-items: center;
      gap: 4px;
    }

    button {
      width: 100%;
      gap: 4px;
      border-radius: 2px;
      background: #d3d3d3;
      height: 33px;
      padding: 0 12px;
      transition: color 0.2s ease-in-out;

      &:hover {
        color: #fff;
      }

      &.orange {
        background: rgb(255, 165, 0);
        color: #fff;

        &:hover {
          color: #000;
        }
      }

      &.red {
        background-color: ${(props) => props.theme.red};
        color: #fff;
      }
      i,
      svg {
        display: flex;
        width: 12px;

        svg {
          width: 100%;
          height: auto;
        }
      }
    }
  }

  h2 {
    font-size: 15px;
  }
`;
