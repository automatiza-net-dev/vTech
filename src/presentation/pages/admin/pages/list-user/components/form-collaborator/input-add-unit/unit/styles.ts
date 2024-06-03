import styled from "styled-components";

export const Unit = styled("div")`
  .unit-content {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: 10px;
    border: 1px solid #e5e5e5;
    padding: 8px;
    border-radius: 4px;

    .text {
      gap: 10px;

      p {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    button {
      padding: 0;
      display: flex;
    }
  }

  .error {
    margin-bottom: 7px;
    font-size: 12.5px;
    color: ${props => props.theme.red};
  }
`;
