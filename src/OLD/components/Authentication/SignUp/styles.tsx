import styled from "styled-components";

export const Container = styled.div<{host?: string}>`
  background-color: ${props => props.theme.primaryColor + "c9"};
  
  color: #ffffff !important;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 50px 100px;
  min-height: 100vh;
  .logo {
    margin-bottom: 50px;
  }
`;

export const Body = styled.div`
  display: flex;
  gap: 15px;
  .img-container {
    height: 100%;
    display: flex;
    align-items: center;
    margin-top: 40px;
    width: 750px;
    @media (max-width: 768px) {
      width: 100%;
    }
  }

  @media (max-width: 1000px) {
    flex-wrap: wrap;
  }
`;
