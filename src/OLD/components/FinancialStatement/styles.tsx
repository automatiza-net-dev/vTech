import styled from "styled-components";

export const Container = styled.section`
  .custom-footer-box {
    margin-left:5%;
    width: 100%;
    min-width: 570px;
  }

  table tr:nth-child(even) {
    background: #c0c0c0;
  }
`;

export const PageWrapperScope = styled.div`
  > section {
    position: relative;
  }
`;

export const PageHeaderActions = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;
