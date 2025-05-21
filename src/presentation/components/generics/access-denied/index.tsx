import { useRouter } from "next/router";

import { Button, LoaderCircle } from "infinity-forge";

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

export function AccessDenied(props?: any) {
  const router = useRouter();

  return props?.loading === "loading" ? (
    <Container className="uk-flex uk-flex-center uk-flex-middle">
      <LoaderCircle size={30} color="#444" />
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
