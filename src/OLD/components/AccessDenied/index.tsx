import { useRouter } from "next/router";

import { Button } from "infinity-forge";
import { LoadingPage } from "@/OLD/components/mini-components";

import styled from "styled-components";

export const Container = styled.section`
  height: 80vh;
  border-radius: 5px;
  background-color: #ffffff;
  margin-top: 2%;

  .custom-text {
    font-size: 20px;
    color: #b0e0e6;
  }
`;

export default function AcessDenied({ loading }: any) {
  const router = useRouter();

  return loading === "loading" ? (
    <Container className="uk-flex uk-flex-center uk-flex-middle">
      <LoadingPage />
    </Container>
  ) : (
    <Container className="uk-flex uk-flex-center uk-flex-middle">
      <div className="uk-text-center">
        <div className="custom-text">Usuário não autorizado</div>
        <Button onClick={() => router.back()} text="Voltar" />
      </div>
    </Container>
  );
}
