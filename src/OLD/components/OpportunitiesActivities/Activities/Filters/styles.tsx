import styled from "styled-components";

export const Container = styled.section`
  section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px;
    p {
      margin: 10px;
    }
  }
  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
`;

export const InputBox = styled.div`
  background-color: #fff;
  border-radius: 40px;
  padding: 0 20px;
  display: flex;

  input,
  .date-component,
  .select-component {
    width: 100%;
  }

  .custom-date-component {
    input {
      font-size: 14px;
    }
  }
`;
