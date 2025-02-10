import React, { useState } from "react";

import { useRouter } from "next/router";

import styled from "styled-components";
import { Table, Tag, Popconfirm } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

import { Button, PageWrapper, useToast } from "infinity-forge";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { recipeServices } from "@/OLD/services/recipes.service";
import { useMedicalRecipes } from "@/OLD/hooks/useMedicalRecipes";

import { LayoutDashboard } from "@/presentation";

export default function MedicalRecipesListPage() {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);

  const router = useRouter();
  const {createToast} = useToast()

  const { documents, loadingDocuments } = useMedicalRecipes(filters, reload);

  const canEditMedicalRecipe = useUserHasPermission("REC02");
  const canDeleteMedicalRecipe = useUserHasPermission("REC03");
  const canCreateMedicalRecipe = useUserHasPermission("REC01");
  const listMedicalRecipesPermission = useUserHasPermission("REC00");

  const removeMedicalRecipe = (id) => {
    recipeServices
      .remove(id)
      .then((_res) =>
         createToast({ status: "success", message: "Modelo de receita médica removida com sucesso!" })
      )
      .catch((err) => { 
        createToast({ status: "error", message:  "Houve um erro ao remover a receita..." })
      })
      .finally(() => {
        setReload(!reload);
      });
  };

  return (
    <LayoutDashboard>
      {!listMedicalRecipesPermission ||
      listMedicalRecipesPermission === "loading" ? (
        <AccessDenied loading={listMedicalRecipesPermission} />
      ) : (
        <PageWrapper title="Receitas médicas">
          <div>
            <div className="uk-flex uk-flex-around uk-margin-top">
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
              <Button
                disabled={!canCreateMedicalRecipe}
                onClick={() => router.push("/dashboard/receitas/cadastrar")}
                text="Cadastrar"
              />
            </div>
            <hr />
            <Table
              onRow={(record) => {
                return {};
              }}
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
                  title: "Ações",
                  render: (record) => (
                    <div className="uk-flex uk-flex-around">
                      {canEditMedicalRecipe && (
                        <EditTwoTone
                          onClick={() => {
                            router.push(
                              `/dashboard/receitas/editar/${record.id}`
                            );
                          }}
                        />
                      )}
                      <Popconfirm
                        title="Deseja remover este modelo de receita?"
                        onConfirm={() => removeMedicalRecipe(record?.id)}
                        okText="Sim"
                        cancelText="Não"
                        placement="left"
                      >
                        {canDeleteMedicalRecipe && (
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
