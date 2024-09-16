import styled from "styled-components";

export const Container = styled.section``;

export const InputBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #fff;
  border-radius: 40px;
  padding: 0 10px;
  border: 0.5px solid #cacaca;
  width: 100%;

  .date-component {
    div {
      width: 100%;
    }
    input {
      font-size: 0.8em;
      width: 200px;
    }
  }

  input,
  .date-component,
  .select-component {
    border: none;
    width: 100%;
  }
`;
