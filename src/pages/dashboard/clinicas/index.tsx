// @ts-nocheck
import { LayoutDashboard } from "@/presentation";

import React, { useEffect, useState, useCallback } from "react";

import Link from "next/link";

import styled from "styled-components";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Tooltip, notification, Table, Popconfirm } from "antd";
import { Button } from "infinity-forge";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { clinicService } from "@/OLD/services/clinic.service";
import { PrivatePage, PageWrapper } from "infinity-forge";

export default function ClinicasPage() {
  return <Page />;
}

function Page() {
  const [filters, setFilters] = useState({});

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const canEditClinic = useUserHasPermission("CLI02");
  const canCreateClinic = useUserHasPermission("CLI01");
  const canDeleteClinic = useUserHasPermission("CLI03");

  const getAllClinics = useCallback(() => {
    if (filters?.fetch) {
      setLoading(true);

      clinicService
        .getClinicsByUser(filters)
        .then((res) =>
          setData(
            res.data.map((item) => {
              return {
                ...item,
                actions: (
                  <div className="uk-flex uk-flex-middle uk-flex-around">
                    {canEditClinic && (
                      <Link
                        href={`/dashboard/clinicas/editar-clinica/${item.id}`}
                      >
                        <EditTwoTone />
                      </Link>
                    )}

                    {canDeleteClinic && <Delete />}
                  </div>
                ),
                identification: (
                  <Link href={`/dashboard/clinicas/${item.id}`}>
                    <CustomLink>
                      {`${item.companyName} - ${item?.fantasyName}`}
                    </CustomLink>
                  </Link>
                ),
                company_name: (
                  <Link href={`/dashboard/clinicas/${item.id}`}>
                    <CustomLink> {item.company_name} </CustomLink>
                  </Link>
                ),
                fantasy_name: (
                  <Link href={`/dashboard/clinicas/${item.id}`}>
                    <CustomLink> {item.fantasy_name} </CustomLink>
                  </Link>
                ),
              };
            })
          )
        )
        .catch(() => {
          notification.error({
            message: "Houve um problema ao recuperar as clinicas vinculadas",
          });
          setLoading(false);
        })
        .finally(() => setLoading(false));
    }
  }, [filters?.reload]);

  useEffect(() => {
    getAllClinics();
  }, [getAllClinics, canEditClinic, canDeleteClinic]);

  return (
    <LayoutDashboard>
      <PageWrapper title="Clinicas">
        <Container>
          <div className="">
            <div className="uk-margin-right uk-flex uk-flex-around uk-margin-small-top">
              <Input>
                <input
                  type="search"
                  placeholder="Busque por Identificação"
                  onChange={(e) =>
                    setFilters({ ...filters, identification: e.target.value })
                  }
                />
              </Input>
              <Input>
                <input
                  type="search"
                  placeholder="Busque por Razão Social ou Nome Fantasia"
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                />
              </Input>
              <Input>
                <input
                  type="search"
                  placeholder="Busque por Cnpj"
                  type="number"
                  onChange={(e) =>
                    setFilters({ ...filters, document: e.target.value })
                  }
                />
              </Input>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              
              <Button
                text="Filtrar"
                onClick={() =>
                  setFilters((prv) => ({
                    ...prv,
                    reload: !prv?.reload,
                    fetch: true,
                  }))
                }
              />
              <Tooltip title={canCreateClinic ? "-" : "Você não tem acesso"}>
                <Link href="/dashboard/clinicas/cadastrar-clinica">
                  <Button text="Cadastrar" />
                </Link>
              </Tooltip>
            </div>
          </div>

          <div className="uk-margin-small-top">
            <Table
              loading={loading}
              columns={[
                {
                  title: "Identificação",
                  dataIndex: "identification",
                  key: "identification",
                },
                {
                  title: "Cnpj",
                  dataIndex: "document",
                  key: "document",
                },
                {
                  title: "Razão social",
                  dataIndex: "companyName",
                  key: "companyName",
                },
                {
                  title: "Nome Fantasia",
                  dataIndex: "fantasyName",
                  key: "fantasyName",
                },
                {
                  title: "Telefone",
                  dataIndex: "phone",
                  key: "phone",
                },
                {
                  title: "Ações",
                  dataIndex: "actions",
                  key: "actions",
                },
              ]}
              dataSource={Object.keys(filters).length === 0 ? [] : data}
              locale={{
                emptyText:
                  Object.keys(filters).length === 0 ? (
                    <>Pesquise acima para exibir o resultado</>
                  ) : (
                    <>Nenhum resultado encontrado</>
                  ),
              }}
            />
          </div>
        </Container>
      </PageWrapper>
    </LayoutDashboard>
  );
}

const Delete = function Delete({}) {
  return (
    <div>
      <Popconfirm
        title="Deseja realmete excluir essa clinica?"
        onConfirm={() =>
          notification.success({ message: "Clinica removida com sucesso" })
        }
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
        <Tooltip title="Deletar">
          <DeleteTwoTone
            twoToneColor="red"
            className="uk-margin-small-bottom"
          />
        </Tooltip>
      </Popconfirm>
    </div>
  );
};

const Input = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 40%;
  background-color: #fff;
  border-radius: 40px;
  padding: 0 20px;
  margin: 2px;
  border: 0.5px solid #cacaca;

  input {
    margin-left: 10px;
    border: none;
    width: 100%;
  }
`;

const Container = styled.div`
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

const CustomLink = styled.span`
  :hover {
    cursor: pointer;
    color: var(--blue);
  }
`;
