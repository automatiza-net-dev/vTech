import { LayoutDashboard } from "@/presentation";

import React, { useState, useCallback, useEffect } from "react";

import { useRouter } from "next/router";

import { Spin } from "antd";

import { Button, FormHandler, PageWrapper, TextEditor, useTextEditor, useToast } from "infinity-forge";
import Editor from "@/OLD/components/Editor";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { recipeServices } from "@/OLD/services/recipes.service";
import LabelsPanel from "@/OLD/components/mini-components/LabelsPanel";

export default function MedicalRecipeEditPage() {
  const [data, setData] = useState<{
    id?: string;
    title?: string;
    description?: string;
    template?: string;
    active?: boolean;
  }>({});
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [startPage, setStartPage] = useState(false);

  const router = useRouter();

  const { createToast } = useToast()

  const canEditMedicalRecipe = useUserHasPermission("REC02");

  const fetchData = useCallback(() => {
    setStartPage(true);
    recipeServices
      .getById(router.query.id)
      .then((res) => {
        setData({
          description: res.data.description,
          template: res.data.template,
          title: res.data.title,
          active: res.data.active,
        });
        setBody(res.data.template);
      })
      .catch((err) => {
        createToast({ status: "error", message: "Erro ao carregar documento", })
      })
      .finally(() => setStartPage(false));
  }, []);

  useEffect(() => fetchData(), [fetchData]);
  const submitData = useCallback(() => {
    if (!(data && data.title && data.title.length > 0)) {
      return createToast({ status: "error", message: "Insira um titulo", })
    }
    if (!(data && data.description && data.description.length > 0)) {
      return createToast({ status: "error", message: "Insira uma descrição", })
    }
    if (!(body && body.length > 0)) {
      return createToast({ status: "error", message: "Insira o corpo do documento", })
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

        createToast({ status: "success", message: "Documento editado com sucesso", })

        router.back();
      })
      .catch((err) => {

        createToast({ status: "error", message: "Erro ao criar documento", })

      })
      .finally(() => setLoading(false));
  }, [loading, data, body, router]);

  const { handleEditorReady, handleInsert } = useTextEditor()

  console.log(data)

  return (
    <LayoutDashboard>
      {!canEditMedicalRecipe || canEditMedicalRecipe === "loading" ? (
        <AccessDenied loading={canEditMedicalRecipe} />
      ) : (
        <PageWrapper title="Editar Receita">
          <div>
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
                    {data?.template && <FormHandler initialData={{ editor: data?.template }} disableEnterKeySubmitForm onChangeForm={{ callbackResult: (result) => setBody(result.editor) }}>
                      <TextEditor name="editor" onEditorReady={handleEditorReady} />
                    </FormHandler>}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <Button onClick={() => router.back()} text="Voltar" />

                    <Button
                      onClick={submitData}
                      text={loading ? "Salvando..." : "Salvar"}
                    />
                  </div>
                </div>
                <LabelsPanel handleInsert={handleInsert} />
              </div>
            )}
          </div>
        </PageWrapper>
      )}
    </LayoutDashboard>
  );
}
