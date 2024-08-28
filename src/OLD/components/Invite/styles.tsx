import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.primaryColor};
  color: #fff !important;
  min-height: 100vh;
  min-width: 100vh;

  .header-section {
    font-size: 14px;
    h2 {
      color: #fff;
    }
  }

  button {
    margin-top: 10px;
    background-color: black;
    width: 100%;
    border-radius: 25px;
    background-color: #1c1c1c !important;
  }

  .pass-container {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr;
  }
  input {
    border-radius: 5px;
  }
  .logo {
    width: 50%;
    margin-left: 50px;
    margin-bottom: 50px;
  }

  .img-container {
    height: 100%;
    width: 100%;
  }

  section {
    width: 50%;
  }

  @media (max-width: 1000px) {
    flex-wrap: wrap;
  }
`;
