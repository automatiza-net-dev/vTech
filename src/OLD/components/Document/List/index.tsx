// @ts-nocheck
// Core
import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";

// Icons
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Hooks
import { useDocuments } from "@/OLD/hooks/useDocs";

// Services
import { documentServices } from "@/OLD/services/document.service";

// Components
import { Button, PageWrapper, useToast } from "infinity-forge";
import { Table, Tag, Popconfirm } from "antd";
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

  const { createToast} = useToast()

  const removeDocument = (id) => {
    setLoading(true);
    documentServices
      .remove(id)
      .then((res) => createToast({ status: "success", message: "Documento removido com sucesso!" })
      )
      .catch((err) => {
        setLoading(false);
        return   createToast({ status: "error", message: "Houve um erro ao remover o documento" })
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
                    <FiEdit2
                      onClick={() => {
                        router.push(`/dashboard/documento/${record.id}`);
                      }}
                      style={{ cursor: 'pointer', fontSize: '1.2rem' }}
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
                      <FiTrash2 
                        className="uk-link" 
                        style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'red' }}
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
      </Container>
    </PageWrapper>
  );
}

export default DocumentList;
