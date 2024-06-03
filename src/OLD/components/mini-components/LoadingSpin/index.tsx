// @ts-nocheck
import React from "react";

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Container } from "./styles";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

export const LoadingSpin = React.memo(function LoadingSpin() {
  return (
    <Container>
      <Spin indicator={antIcon} />
    </Container>
  );
});
