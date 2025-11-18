import styled from "styled-components";

export const Container = styled.div``;

export const Input = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 40%;
  background-color: #fff;
  border-radius: 40px;
  padding: 0 20px;
  margin: 2px;
  gap: 10px;
`;

export const InputBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #fff;
  border-radius: 40px;
  padding: 0 20px;

  input,
  .date-component,
  .select-component {
    width: 100%;
    border-radius: 5px;
  }
`;
