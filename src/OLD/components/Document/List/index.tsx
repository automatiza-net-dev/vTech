// @ts-nocheck
// Core
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";

// Icons
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

// Hooks
import { useDocuments } from "@/OLD/hooks/useDocs";

// Services
import { documentServices } from "@/OLD/services/document.service";

// Components
import { Button, PageWrapper } from "infinity-forge";
import { Table, Tag, Popconfirm, notification } from "antd";
import { Container, InputBox } from "./styles";
import AccessDenied from "@/OLD/components/AccessDenied";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

function DocumentList() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState({});
  const { documents, loadingDocuments, fetchDocuments } = useDocuments(
    filters,
    reload
  );

  const listDocumentsPermission = useUserHasPermission("DOC00");
  const canCreateDocument = useUserHasPermission("DOC01");
  const canEditDocument = useUserHasPermission("DOC02");
  const canDeleteDocument = useUserHasPermission("DOC03");

  const removeDocument = (id) => {
    setLoading(true);
    documentServices
      .remove(id)
      .then((res) =>
        notification.success({ message: "Documento removido com sucesso!" })
      )
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao remover o documento",
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload);
      });
  };

  return !listDocumentsPermission || listDocumentsPermission === "loading" ? (
    <AccessDenied loading={listDocumentsPermission} />
  ) : (
    <PageWrapper title="Documentos">
      <Container>
        <div className="uk-flex uk-margin-top uk-flex-around">
          <InputBox>
            <input
              type="search"
              placeholder="Busque por título"
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
            />
          </InputBox>
          <InputBox>
            <input
              type="search"
              placeholder="Busque por descrição"
              onChange={(e) =>
                setFilters({ ...filters, description: e.target.value })
              }
            />
          </InputBox>
          {canCreateDocument && (
            <Button
              onClick={() => router.push("/dashboard/documento/cadastrar")}
              text="Cadastrar"
            />
          )}
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
              key: "title",
              dataIndex: "title",
            },
            {
              title: "Descrição",
              key: "description",
              dataIndex: "description",
            },
            {
              title: "Tipo",
              key: "type",
              dataIndex: "type",
              render: (record) =>
                record === "text" ? <span>Texto</span> : record,
            },
            {
              title: "Ações",
              render: (record) => (
                <div className="uk-flex uk-flex-around">
                  {canEditDocument && (
                    <EditTwoTone
                      onClick={() => {
                        router.push(`/dashboard/documento/${record.id}`);
                      }}
                    />
                  )}
                  <Popconfirm
                    title="Deseja remover este documento?"
                    onConfirm={() => removeDocument(record?.id)}
                    okText="Sim"
                    cancelText="Não"
                    placement="left"
                  >
                    {canDeleteDocument && (
                      <DeleteTwoTone className="uk-link" twoToneColor={"red"} />
                    )}
                  </Popconfirm>
                </div>
              ),
            },
          ]}
          dataSource={documents}
          loading={loadingDocuments}
        />
      </Container>
    </PageWrapper>
  );
}

export default DocumentList;
