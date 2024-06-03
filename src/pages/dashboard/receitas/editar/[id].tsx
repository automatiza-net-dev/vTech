import { LayoutDashboard } from "@/presentation";

import React, { useState, useCallback, useEffect } from "react";

import { useRouter } from "next/router";

import { notification, Spin } from "antd";

import Editor from "@/OLD/components/Editor";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { recipeServices } from "@/OLD/services/recipes.service";
import LabelsPanel from "@/OLD/components/mini-components/LabelsPanel";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

export default function MedicalRecipeEditPage() {
  const [data, setData] = useState<{
    title?: string;
    description?: string;
    active?: boolean;
  }>({});
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [startPage, setStartPage] = useState(false);

  const router = useRouter();

  const canEditMedicalRecipe = useUserHasPermission("REC02");

  const fetchData = useCallback(() => {
    setStartPage(true);
    recipeServices
      .getById(router.query.id)
      .then((res) => {
        setData({
          description: res.data.description,
          title: res.data.title,
          active: res.data.active,
        });
        setBody(res.data.template);
      })
      .catch((err) => {
        notification.error({
          message: "Erro ao carregar documento",
        });
      })
      .finally(() => setStartPage(false));
  }, []);

  useEffect(() => fetchData(), [fetchData]);
  const submitData = useCallback(() => {
    if (!(data && data.title && data.title.length > 0)) {
      return notification.error({
        message: "Insira um titulo",
      });
    }
    if (!(data && data.description && data.description.length > 0)) {
      return notification.error({
        message: "Insira uma descrição",
      });
    }
    if (!(body && body.length > 0)) {
      return notification.error({
        message: "Insira o corpo do documento",
      });
    }
    if (loading) return;
    setLoading(true);

    recipeServices
      .update(router.query.id, {
        header: "header",
        ...data,
        template: body,
      })
      .then((res) => {
        notification.success({
          message: "Documento editado com sucesso",
        });
        router.back();
      })
      .catch((err) => {
        notification.error({
          message: "Erro ao criar documento",
        });
      })
      .finally(() => setLoading(false));
  }, [loading, data, body, router]);

  return (
    <LayoutDashboard>
      {!canEditMedicalRecipe || canEditMedicalRecipe === "loading" ? (
        <AccessDenied loading={canEditMedicalRecipe} />
      ) : (
        <div className="uk-container uk-padding">
          <div className="uk-flex uk-flex-between uk-flex-middle">
            <h3 className="uk-margin-remove">Editar receita</h3>
          </div>
          {startPage ? (
            <div className="uk-flex uk-flex-center">
              <Spin spinning size="large" />{" "}
            </div>
          ) : (
            <div className="uk-card uk-card-default uk-card-body uk-margin-top uk-flex">
              <div className="uk-width-5-6">
                <div className="uk-margin-small">
                  <label>Ativo</label>
                  <select
                    className="uk-select"
                    value={data?.active?.toString()}
                    onChange={(e) =>
                      setData({
                        ...data,
                        active: e.target.value === "true" ? true : false,
                      })
                    }
                  >
                    <option value={"true"}>Ativo</option>
                    <option value={"false"}>Inativo</option>
                  </select>
                </div>
                <div className="uk-margin-small">
                  <label>Titulo</label>
                  <input
                    type="text"
                    className="uk-input"
                    placeholder="Titulo do documento"
                    value={data?.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="uk-margin-small">
                  <label>Descrição</label>
                  <textarea
                    className="uk-textarea"
                    placeholder="Descrição do documento"
                    value={data?.description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="uk-margin-small">
                  <label>Conteúdo</label>
                  <Editor editorState={body} setEditorState={setBody} />
                </div>
                <div className="uk-margin-top">
                  <CustomButton
                    classCallback="uk-margin-right"
                    onClick={() => router.back()}
                  >
                    Voltar
                  </CustomButton>
                  <CustomButton onClick={submitData}>
                    {loading ? "Salvando..." : "Salvar"}
                  </CustomButton>
                </div>
              </div>
              <LabelsPanel body={body} setBody={setBody} />
            </div>
          )}
        </div>
      )}
    </LayoutDashboard>
  );
}
