// @ts-nocheck

import { Spin } from "antd";
import { Container } from "./styles";

export function LoadingPage() {
  return (
    <Container>
      <Spin tip="Carregando..." />
    </Container>
  );
}
