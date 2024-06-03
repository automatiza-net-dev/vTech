// @ts-nocheck
import { notification, Table } from "antd";
import { Button } from "@/OLD/components/mini-components/Button";
import { LoadingSkeleton } from "@/OLD/components/mini-components";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { userService } from "@/OLD/services/user.service";
import { Container } from "./styles";

// Core
import Link from "next/link";

export const Details = React.memo(function () {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = router?.query?.id;
    setLoading(true);
    userService
      .getOneUser(id)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Erro ao buscar colaborador",
        });
      });
    setLoading(false);
  }, []);

  return loading ? (
    <LoadingSkeleton active={true} />
  ) : (
    <Container className="uk-padding">
      <div>
        <div className="uk-flex uk-flex-between uk-margin-small-bottom">
          <div>
            <h2>Colaborador: {user?.name}</h2>
          </div>
          <div className="uk-flex right-small">
            <div>
              <Button className="right-small" onClick={() => router.back()}>
                Voltar
              </Button>
            </div>
            <Link
              href={`/dashboard/colaborador/editar-colaborador/${user?.id}`}
            >
              <div>
                <Button> Editar colaborador </Button>
              </div>
            </Link>
          </div>
        </div>
        <div className="uk-flex uk-margin-bottom" style={{ gap: "22px" }}>
          <div className="uk-flex uk-flex-column uk-width-1-2 uk-card uk-card-body">
            <h5 className="uk-heading-line">
              <span>Documentos</span>
            </h5>
            <span>
              Nome:{" "}
              {!user?.name ? "Nenhum nome fantasia cadastrado" : user?.name}
            </span>
            <span>
              CPF: {!user?.document ? "Nenhum CNPJ cadastrado" : user?.document}
            </span>
          </div>
          <div className="uk-flex uk-flex-column uk-width-1-2 uk-card uk-card-body">
            <h5 className="uk-heading-line">
              <span>Contato</span>
            </h5>

            <span>
              Telefone:{" "}
              {!user?.phone ? "Nenhum telefone cadastrado" : user?.phone}
            </span>
            <span>
              Email: {!user?.email ? "Nenhum email cadastrado" : user?.email}
            </span>
          </div>
        </div>
        <div className="uk-flex uk-margin-bottom" style={{ gap: "22px" }}>
          <div className="uk-card uk-card-body uk-margin-bottom uk-width-1-2">
            <h5 className="uk-heading-line">
              <span>Endereço</span>
            </h5>
            <div className="uk-flex">
              <div className="uk-flex uk-flex-column uk-width-1-1">
                <span>
                  CEP:{" "}
                  {!user?.postal_code
                    ? "Nenhum cep cadastrado"
                    : user?.postal_code}
                </span>
                <span>
                  Rua:{" "}
                  {!user?.address ? "Nenhuma rua cadastrada" : user?.address}
                </span>
                <span>
                  Bairro:{" "}
                  {!user?.district
                    ? "Nenhum bairro cadastrado"
                    : user?.district}
                </span>
                <span>
                  Complemento:{" "}
                  {!user?.complement
                    ? "Nenhum complemento cadastrado"
                    : user?.complement}
                </span>
                <span>
                  Número:{" "}
                  {!user?.number ? "Nenhum número cadastrado" : user?.number}
                </span>
                <span>
                  Cidade:{" "}
                  {!user?.city ? "Nenhuma cidade cadastrada" : user?.city}
                </span>
                <span>
                  Estado:{" "}
                  {!user?.state ? "Nenhum estado cadastrado" : user?.state}
                </span>
              </div>
            </div>
          </div>
          <div className="uk-card uk-card-body uk-margin-bottom uk-width-1-2">
            <h5 className="uk-heading-line">
              <span>Dados profissionais</span>
            </h5>
            <div className="uk-flex">
              <div className="uk-flex uk-flex-column uk-width-1-1">
                <span>
                  Registro Conselho:{" "}
                  {!user?.licensing_job
                    ? "Nenhum registro conselho cadastrado"
                    : user?.licensing_job}
                </span>
                <span>
                  Plantonista Avulso: {!user?.on_duty ? "Não" : "Sim"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
});
