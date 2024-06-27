import styled from "styled-components";

export const InputBox = styled.div`
  align-items: center;
  background-color: #fff;
  border-radius: 40px;
  display: flex;
  height: 40px;
  padding: 0 20px;

  input,
  .date-component,
  .select-component {
    width: 100%;
  }

  .custom-datepicker {
    input {
      font-size: 14px;
    }
  }
`;
