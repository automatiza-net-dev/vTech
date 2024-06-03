import React, { useState } from "react";

import { useRouter } from "next/router";

import styled from "styled-components";
import { Table, Tag, notification, Popconfirm } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

import { SearchIcon } from "@/OLD/common/icons";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { recipeServices } from "@/OLD/services/recipes.service";
import { useMedicalRecipes } from "@/OLD/hooks/useMedicalRecipes";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

import { LayoutDashboard } from "@/presentation";

export default function MedicalRecipesListPage() {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);

  const router = useRouter();

  const { documents, loadingDocuments } = useMedicalRecipes(filters, reload);

  const canEditMedicalRecipe = useUserHasPermission("REC02");
  const canDeleteMedicalRecipe = useUserHasPermission("REC03");
  const canCreateMedicalRecipe = useUserHasPermission("REC01");
  const listMedicalRecipesPermission = useUserHasPermission("REC00");

  const removeMedicalRecipe = (id) => {
    recipeServices
      .remove(id)
      .then((_res) =>
        notification.success({
          message: "Modelo de receita médica removida com sucesso!",
        })
      )
      .catch((err) => {
        notification.error({
          message: "Houve um erro ao remover a receita...",
        });
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
        <div className="uk-container uk-padding">
          <h3 className="uk-margin-remove">Receitas médicas</h3>
          <div className="uk-flex uk-flex-around uk-margin-top">
            <InputBox>
              <input
                type="search"
                placeholder="Busque por título"
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
              />
              <SearchIcon />
            </InputBox>
            <InputBox>
              <input
                type="search"
                placeholder="Busque por descrição"
                onChange={(e) =>
                  setFilters({ ...filters, description: e.target.value })
                }
              />
              <SearchIcon />
            </InputBox>
            <CustomButton
              disabled={!canCreateMedicalRecipe}
              className="uk-button uk-button-primary"
              onClick={() => router.push("/dashboard/receita/cadastrar")}
            >
              Cadastrar
            </CustomButton>
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
                          router.push(`/dashboard/receitas/editar/${record.id}`);
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

  input {
    margin-left: 10px;
    border: none;
    width: 100%;
  }
`;
