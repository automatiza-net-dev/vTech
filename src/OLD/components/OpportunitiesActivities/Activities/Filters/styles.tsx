import styled from "styled-components";

export const Container = styled.section``;

export const InputBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #fff;
  border-radius: 40px;
  padding: 0 20px;

  input, .date-component, .select-component {
    border: none;
    width: 100%;
  }

  .custom-date-component {
    input {
      font-size: 14px;
    }
  }
`;
