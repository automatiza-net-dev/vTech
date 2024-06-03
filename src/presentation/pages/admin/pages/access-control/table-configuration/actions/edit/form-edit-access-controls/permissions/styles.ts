import styled from "styled-components";

export const Permissions = styled("div")`
  > div {
    margin-bottom: 5px;
    border: 1px solid #d9d9d9;
  }

  summary {
    display: flex;
    padding: 10px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
  }

  .permissions {
    display: flex;
    flex-direction: column;
    padding: 0 5px 5px;

    > div {
      margin-bottom: 4px;
    }

    label {
      margin-bottom: 0;
    }
  }
`;
