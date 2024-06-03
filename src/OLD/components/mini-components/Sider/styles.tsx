// @ts-nocheck
import styled from "styled-components";

export const Container = styled.div`
  aside {
    background-color: ${process.env.client === "sancla"  ?"var(--orange-light-1)" : "var(--lo-blue)"};

    min-height: 100% !important;
    .ant-menu {
      background-color: transparent;
    }

    .ant-layout-sider-trigger {
    background-color: ${process.env.client === "sancla"  ?"var(--orange-light-1)" : "var(--lo-blue)"};
  }
}
`;
