import styled from "styled-components";

export const Container = styled.div`
  padding: 40px 80px;
  min-height: 100vh;
  background-color: ${props => props.theme.primaryColor};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 100px;

  font-size: 14px;

  h3 {
    color: #ffffff;
  }

  .left-side {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .border-radius {
    border-radius: 10px;
  }

  .uk-card {
    min-width: 450px;
  }

  .checkbox {
    display: flex;
    align-items: center;
    label {
      margin-left: 5px;
    }
    input {
      margin-top: 0px;
    }
  }
`;
