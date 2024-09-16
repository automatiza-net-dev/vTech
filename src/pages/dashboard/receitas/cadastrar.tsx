import React, { useState, useCallback } from "react";

import { useRouter } from "next/router";

import { notification } from "antd";

import { Button, PageWrapper } from "infinity-forge";
import Editor from "@/OLD/components/Editor";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { recipeServices } from "@/OLD/services/recipes.service";
import LabelsPanel from "@/OLD/components/mini-components/LabelsPanel";
import { LayoutDashboard } from "@/presentation";

export default function MedicalRecipeCreatePage() {
  const router = useRouter();
  const [data, setData] = useState<{
    title?: string;
    description?: string;
    active?: boolean;
  }>({});
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const canCreateMedicalRecipe = useUserHasPermission("REC01");

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
      .create({
        header: "header",
        ...data,
        template: body,
      })
      .then((res) => {
        notification.success({
          message: "Documento criado com sucesso",
        });
        router.back();
      })
      .catch((err) => {
        notification.error({
          message: "Erro ao criar documento",
        });
      })
      .finally(() => setLoading(false));
  }, [loading, data, body]);

  return (
    <LayoutDashboard>
      {!canCreateMedicalRecipe || canCreateMedicalRecipe === "loading" ? (
        <AccessDenied loading={canCreateMedicalRecipe} />
      ) : (
        <PageWrapper title="Cadastrar Receita">
          <div>
            <div className="uk-card uk-card-default uk-card-body uk-margin-top uk-flex">
              <div className="uk-width-5-6">
                <div className="uk-margin-small">
                  <label>Titulo</label>
                  <input
                    type="text"
                    className="uk-input"
                    placeholder="Titulo da receita"
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
                    placeholder="Descrição da receita"
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Button
                    text={loading ? "Salvando..." : "Salvar"}
                    onClick={submitData}
                  />

                  <Button onClick={() => router.back()} text="Voltar" />
                </div>
              </div>
              <LabelsPanel body={body} setBody={setBody} />
            </div>
          </div>
        </PageWrapper>
      )}
    </LayoutDashboard>
  );
}
