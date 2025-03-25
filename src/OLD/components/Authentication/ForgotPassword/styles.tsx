// @ts-nocheck
import styled from "styled-components";

export const Container = styled.div`
  background-color: ${props => props.theme.primaryColor};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .form-side {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .border-radius {
    border-radius: 10px;
  }
`;
