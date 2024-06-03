import styled from "styled-components";

export const Container = styled.div`
  height: 20%;

  .red-alert {
    color: var(--red);
  }

  .buttons-container {
    min-width: 400px;
  }

  .antd-tag-dashed {
    border: dashed 0.5px var(--gray);
    cursor: pointer;
  }

  img {
    width: 150px;
    border: solid 4px var(--darkBlue);
    border-radius: 10px;
  }

  .inf-box {
    line-height: 1.5em;
  }

  .tutor-name {
    font-size: 1.3em;
  }

  @media (min-width: 1000px) {
    display: flex;
  }

  @media (max-width: 999px) {
    .sub-container {
      margin-top: 7%;
    }
  }
`;

export const InputOverflow = styled.div`
  overflow: auto;
  max-height: 150px;
  max-width: 300px;
  padding: 2px;
`;
