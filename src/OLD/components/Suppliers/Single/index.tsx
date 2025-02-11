// @ts-nocheck
import React, { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { petsService } from "@/OLD/services/patient.service";
import { Table } from "antd";
import { LoadingSkeleton } from "@/OLD/components/mini-components";
import { Button, PageWrapper } from "infinity-forge";
import Link from "next/link";
import { convertDate } from "@/OLD/utils/convertDate";

import { useSingleSupplier } from "@/OLD/hooks/useSuppliers";

const Single = memo(function Single() {
  const [loading, setLoading] = useState(false);
  const [photoSrc, setPhotoSrc] = useState(false);
  const router = useRouter();
  const id = router.query.id;

  const { supplier } = useSingleSupplier(id);

  useEffect(() => {
    supplier?.photo &&
      setPhotoSrc(process.env.NEXT_PUBLIC_API + supplier?.photo);
  }, [supplier]);

  return loading ? (
    <LoadingSkeleton />
  ) : (
    <PageWrapper title="Detalhes do fornecedor">
      <div>
        <div
          className="uk-card uk-card-body uk-margin-bottom"
          style={{
            background: "#fff",
            borderRadius: "20px",
            marginTop: "50px",
            border: "0.5px solid #cacaca",
          }}
        >
          <>
            <div className="uk-margin-large-bottom">
              <div
                style={{
                  borderRadius: "50%",
                  background: "#ccc",
                  width: "115px",
                  height: "115px",
                  display: "flex",
                  border: "solid 3px var(--darkBlue)",
                  marginTop: "50px",
                  position: "absolute",
                  top: -80,
                }}
              >
                <img
                  className="uk-border-circle"
                  width="115px"
                  height="115px"
                  src={
                    photoSrc
                      ? photoSrc
                      : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  }
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 40,
                }}
              >
                <Link href={`/dashboard/fornecedores/editar/${id}`}>
                  <Button text="Editar" />
                </Link>
              </div>
            </div>

            <div className="uk-flex uk-flex-between">
              <div className="uk-flex uk-flex-column uk-width-1-4 uk-margin-top">
                <h5 className="uk-heading-line">
                  <span>Contato</span>
                </h5>
                <span>
                  Telefone:{" "}
                  {supplier?.tutor?.telephone === ""
                    ? "Nenhum telefone cadastrado"
                    : supplier?.tutor?.telephone}
                </span>
                <span>
                  Celular:{" "}
                  {supplier?.tutor?.cellphone === ""
                    ? "Nenhum telefone cadastrado"
                    : supplier?.tutor?.telephone}
                </span>
                <span>
                  Email:{" "}
                  {supplier?.tutor?.email === ""
                    ? "Nenhum email cadastrado"
                    : supplier?.tutor?.email}
                </span>
              </div>
              <div className="uk-flex uk-flex-column uk-width-1-4">
                <h5 className="uk-heading-line">
                  <span>Documentos</span>
                </h5>
                <span>
                  CNPJ:{" "}
                  {supplier?.tutor?.document === ""
                    ? "Nenhum documento cadastrado"
                    : supplier?.tutor?.document}
                </span>
                <span>
                  Incrição estadual:{" "}
                  {supplier?.tutor?.inscription === ""
                    ? "Nenhum documento cadastrado"
                    : supplier?.tutor?.inscription}
                </span>
                <span>
                  Razão Social:{" "}
                  {supplier?.tutor?.corporate_name === ""
                    ? "Nenhum telefone cadastrado"
                    : supplier?.tutor?.corporate_name}
                </span>
                <span>
                  Nome Fantasia:{" "}
                  {supplier?.name === ""
                    ? "Nome fantasia não cadastrado"
                    : supplier?.name}
                </span>
                <span>
                  Plano de contas padrão:
                  {supplier?.tutor?.accountPlan?.description === ""
                    ? "-"
                    : supplier?.tutor?.accountPlan?.description}
                </span>
              </div>

              <div className="uk-flex uk-flex-column uk-width-1-4">
                <h5 className="uk-heading-line">
                  <span>Endereço</span>
                </h5>
                <span>
                  CEP:{" "}
                  {supplier?.tutor?.postal_code === ""
                    ? "Nenhum cep cadastrado"
                    : supplier?.tutor?.postal_code}
                </span>
                <span>
                  Rua:{" "}
                  {supplier?.tutor?.street === ""
                    ? "Nenhuma rua cadastrada"
                    : supplier?.tutor?.street}
                </span>
                <span>
                  Bairro:{" "}
                  {supplier?.tutor?.district === ""
                    ? "Nenhum bairro cadastrado"
                    : supplier?.tutor?.district}
                </span>
                <span>
                  Complemento:{" "}
                  {supplier?.tutor?.complement === ""
                    ? ""
                    : supplier?.tutor?.complement}
                </span>
                <span>
                  Número:{" "}
                  {supplier?.tutor?.number === ""
                    ? "Nenhum número cadastrado"
                    : supplier?.tutor?.number}
                </span>
                <span>
                  Cidade:{" "}
                  {supplier?.tutor?.city === ""
                    ? "Nenhuma cidade cadastrada"
                    : supplier?.tutor?.city}
                </span>
                <span>
                  Estado:{" "}
                  {supplier?.tutor?.state === ""
                    ? "Nenhum estado cadastrado"
                    : supplier?.tutor?.state}
                </span>
              </div>
            </div>
          </>
        </div>
      </div>
    </PageWrapper>
  );
});

export default Single;
