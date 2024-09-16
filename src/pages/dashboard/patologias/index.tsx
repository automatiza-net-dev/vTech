import React, { useState } from "react";

import { useRouter } from "next/router";

import { Table, Tag, notification, Popconfirm } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

import { Button, PageWrapper } from "infinity-forge";
import AccessDenied from "@/OLD/components/AccessDenied";
import { usePathologies } from "@/OLD/hooks/usePathologies";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { pathologiesServices } from "@/OLD/services/pathologies.service";

import { LayoutDashboard } from "@/presentation";

export default function PathologiesListPage() {
  const router = useRouter();
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState({});
  const { documents, loadingDocuments } = usePathologies(filters, reload);

  const canEditPathology = useUserHasPermission("PAT02");
  const canCreatePathology = useUserHasPermission("PAT01");
  const canDeletePathology = useUserHasPermission("PAT03");
  const listPathologiesPermission = useUserHasPermission("PAT00");

  const removePathology = (id) => {
    pathologiesServices
      .remove(id)
      .then((_res) =>
        notification.success({ message: "Patologia removida com sucesso" })
      )
      .catch((_err) => {
        return notification.error({
          message: "Houve um erro ao remover a patologia...",
        });
      })
      .finally(() => {
        setReload(!reload);
      });
  };

  return (
    <LayoutDashboard>
      {!listPathologiesPermission || listPathologiesPermission === "loading" ? (
        <AccessDenied loading={listPathologiesPermission} />
      ) : (
        <PageWrapper title="Patologias">
          <div>
            <div>
              <InputBox className="uk-margin-right">
                <input
                  type="search"
                  placeholder="Busque por descrição"
                  onChange={(e) =>
                    setFilters({ ...filters, description: e.target.value })
                  }
                />
    
              </InputBox>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                disabled={!canCreatePathology}
                onClick={() => router.push("/dashboard/patologia/cadastrar")}
                text="Cadastrar"
              />
            </div>
            <hr />
            <Table
              className="uk-margin-top"
              columns={[
                {
                  title: "Ativo",
                  dataIndex: "active",
                  key: "active",
                  render: (status) => (
                    <Tag color={status ? "green" : "red"}>
                      {status ? "Ativo" : "Inativo"}
                    </Tag>
                  ),
                },
                {
                  title: "Título",
                  key: "description",
                  dataIndex: "description",
                },
                {
                  title: "Descrição",
                  key: "definition",
                  dataIndex: "definition",
                },
                {
                  title: "Ações",
                  render: (record) => (
                    <div className="uk-flex uk-flex-around">
                      {canEditPathology && (
                        <EditTwoTone
                          onClick={() => {
                            router.push(`/dashboard/patologia/${record.id}`);
                          }}
                        />
                      )}
                      <Popconfirm
                        title="Deseja remover esta patologia?"
                        onConfirm={() => removePathology(record?.id)}
                        okText="Sim"
                        cancelText="Não"
                        placement="left"
                      >
                        {canDeletePathology && (
                          <DeleteTwoTone
                            className="uk-link"
                            twoToneColor={"red"}
                          />
                        )}
                      </Popconfirm>
                    </div>
                  ),
                },
              ]}
              dataSource={documents}
              loading={loadingDocuments}
            />
          </div>
        </PageWrapper>
      )}
    </LayoutDashboard>
  );
}

import styled from "styled-components";

export const InputBox = styled.div`
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
