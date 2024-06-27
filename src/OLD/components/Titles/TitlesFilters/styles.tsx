import styled from "styled-components";

export const Container = styled.div``;

export const InputBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #fff;
  border-radius: 40px;
  padding: 0 10px;

  .date-component {
    div {
      width: 100%;
    }
    input {
      font-size: 14px;
      width: 220px;
    }
  }

  input,
  .date-component,
  .select-component {
    border: none;
    width: 100%;
  }

  .custom-input {
    border: 1px solid var(--cinza-200, #e1e1e1);
  }
`;
