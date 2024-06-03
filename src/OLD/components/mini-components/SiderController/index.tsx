// @ts-nocheck
import { memo, useState, useCallback, useContext } from "react";

import { AppContext } from "@/OLD/context/appContext";

import { useRouter } from "next/router";

import { Layout, Menu } from "antd";
import { Container } from "./styles";

const SiderController = memo(function SiderController() {
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter();
  const { user } = useContext(AppContext);
  

  

  const changeRoute = useCallback(
    ({ key }) => {
      if (key === "logout") {
        user.dispatch({ type: "LOGOUT_USER" });
        router.push("/");
      } else {
        router.push(key);
      }
    },
    [user]
  );

  return (
    <Container host={process.env.clientName}>
      <Layout.Sider
        width={300}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          defaultSelectedKeys={["controller"]}
          selectedKeys={[router.asPath]}
          mode="inline"
          onSelect={changeRoute}
        ></Menu>
      </Layout.Sider>
    </Container>
  );
});

export default SiderController;
