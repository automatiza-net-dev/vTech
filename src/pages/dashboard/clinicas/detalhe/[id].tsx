import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import styled from "styled-components";
import { LayoutDashboard } from "@/presentation";
import { useSingleClinic } from "@/OLD/hooks/useClinics";
import { Button } from "@/OLD/components/mini-components/Button";
import { PrivatePageAdmin } from "infinity-forge";

export default function DetailClinic() {
 
  return <PrivatePageAdmin>
    <Page />
  </PrivatePageAdmin>
}

function Page() {
  const router = useRouter();

  const { clinic } = useSingleClinic(router.query.id);

  return (
    <LayoutDashboard>
      <Container className="uk-padding uk-container">
        <h2 className="uk-margin-remove">Clinica</h2>
        <div className="uk-margin-medium-top">
          <div className="uk-flex uk-flex-between">
            <h2>{clinic?.fantasyName}</h2>
            <div className="uk-flex uk-flex-left" style={{ gap: "10px" }}>
              <Link href={"/dashboard/clinicas"}>
                <Button theme="secondary">Voltar</Button>
              </Link>
              <Link href={`/dashboard/clinicas/editar-clinica/${clinic?.id}`}>
                <Button>Editar clinica</Button>
              </Link>
            </div>
          </div>
          <h3 className="uk-heading-line">
            <span>Dados</span>
          </h3>
          <div className="uk-card uk-card-body">
            <div className="uk-flex uk-flex-between">
              <div className="uk-flex uk-flex-column">
                <span>
                  Nome fantasia:{" "}
                  {clinic?.fantasyName === ""
                    ? "Nenhum nome fantasia cadastrado"
                    : clinic?.fantasyName}
                </span>
                <span>Razão social: {clinic?.companyName}</span>
                <span>
                  CNPJ:{" "}
                  {clinic?.document === ""
                    ? "Nenhum CNPJ cadastrado"
                    : clinic?.document}
                </span>
              </div>
            </div>
          </div>
          <h3 className="uk-heading-line">
            <span>Endereço</span>
          </h3>
          <div className="uk-card uk-card-body">
            <div className="uk-flex uk-flex-between">
              <div className="uk-flex uk-flex-column">
                <span>
                  CEP:{" "}
                  {clinic?.postalCode === ""
                    ? "Nenhum cep cadastrado"
                    : clinic?.postalCode}
                </span>
                <span>
                  Rua:{" "}
                  {clinic?.address === ""
                    ? "Nenhuma rua cadastrada"
                    : clinic?.address}
                </span>
                <span>
                  Bairro:{" "}
                  {clinic?.district === ""
                    ? "Nenhum bairro cadastrado"
                    : clinic?.district}
                </span>
                <span>
                  Complemento:{" "}
                  {clinic?.complement === "" ? "" : clinic?.complement}
                </span>
                <span>
                  Número:{" "}
                  {clinic?.number === ""
                    ? "Nenhum número cadastrado"
                    : clinic?.number}
                </span>
                <span>
                  Cidade:{" "}
                  {clinic?.city === ""
                    ? "Nenhuma cidade cadastrada"
                    : clinic?.city}
                </span>
                <span>
                  Estado:{" "}
                  {clinic?.state === ""
                    ? "Nenhum estado cadastrado"
                    : clinic?.state}
                </span>
              </div>
            </div>
          </div>

          <h3 className="uk-heading-line">
            <span>Contato</span>
          </h3>
          <div className="uk-card uk-card-body">
            <div className="uk-flex uk-flex-between">
              <div className="uk-flex uk-flex-column">
                <span>
                  Telefone:{" "}
                  {clinic?.phone === ""
                    ? "Nenhum telefone cadastrado"
                    : clinic?.phone}
                </span>
                <span>
                  Email:{" "}
                  {clinic?.email === ""
                    ? "Nenhum email cadastrado"
                    : clinic?.email}
                </span>
                <span>
                  Identificação:{" "}
                  {clinic?.identification === ""
                    ? "Nenhuma identificação cadastrada"
                    : clinic?.identification}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </LayoutDashboard>
  );
}

export const Container = styled.div`
  .ant-menu-horizontal {
    background-color: transparent !important;
    border-bottom: 1px solid lightgray;
  }
  .uk-card {
    border: 2px solid #ebebeb;
    border-radius: 20px;
    background-color: #fff;
  }
`;
 