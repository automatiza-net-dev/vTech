import { Result } from "antd";
import Link from "next/link";
import React from "react";

export function ResultPage() {
  return (
    <Result
      status="success"
      title="Conta criada com sucesso!"
      extra={[<Link href="/dashboard">Ir para a dashboard</Link>]}
    />
  );
}
