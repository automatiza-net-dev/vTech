// @ts-nocheck
import styled from "styled-components";

export const Container = styled.div`
  .custom-user-name {
    h2 {
      color: #ffffff !important;
    }
  }

  header {
    background-color: ${props => props.theme.primaryColor};
  }

  .logo-container {
    padding: 0 23px;
  }
  .profile {
    padding: 0 10px;
  }
  .profile-img {
    background-color: ${({ host }) =>
      host === "LiftOne" ? "var(--lo-blue)" : "#ffffff"};
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
  .profile-text {
    padding: 0 10px;
  }
`;

export const Input = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 400px;
  max-width: 100%;
  background-color: #fff;
  border-radius: 40px;
  padding: 0 20px;
  margin: 0 40px;

  @media (max-width: 800px) {
    margin: 0 !important;
  }

  input {
    margin-left: 10px;
    border: none;
    width: 100%;
    height: 40px;
  }
`;
