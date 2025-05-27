// @ts-nocheck
import React from "react";

import { FiLoader } from "react-icons/fi";
import { Container } from "./styles";

export const LoadingSpin = React.memo(function LoadingSpin() {
  return (
    <Container>
      <FiLoader
        style={{
          fontSize: 24,
          color: "#1890ff",
          animation: "spin 1s linear infinite",
        }}
      />
    </Container>
  );
});
