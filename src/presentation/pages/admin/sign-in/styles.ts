import styled from "styled-components";

export const Login = styled("div")`
  min-height: 100vh;
  padding: 30px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 17px;
    text-align: center;
  }

  .form-login {
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
  }

  .link-area-franqueado {
    text-align: center;
    margin-top: 20px;

    a {
      color: ${(props) => props.theme.primaryColor};
      font-size: 13px;
    }
  }
`;