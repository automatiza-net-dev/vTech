import styled from "styled-components";

export const Create = styled("div")`
  h2 {
    text-align: center;
    color: #2b2b2b;
    margin-bottom: 20px;
  }

  label {
    margin-bottom: 8px;
    color: #2b2b2b;
  }

  .container-switch {
    display: block;
  }

  .row-main {
    display: flex;
    width: 100%;
    gap: 30px;

    > div {
      width: 100%;
    }
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div:nth-child(2) {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &:first-child {
      > div:last-child {
        /* max-width: fit-content; */
      }
    }
  }
`;
