import styled from "styled-components";

export const Layout = styled("div")`
  display: flex;
  width: 100%;
  background-color: #fff;
  overflow-x: hidden !important;

  .content {
    width: 100%;
    background-color: #f9f9f9;
  }

  .goBack {
    background-color: #f5f5f5;
  }

  .page {
    width: 100%;
    padding: 25px 30px;
    min-height: calc(100vh - 70px);
    background-color: #f9f9f9;
  }
`;
