import React, { useState, useCallback, useEffect } from "react";

import { useRouter } from "next/router";

import { Spin } from "antd";

import { Button, useToast } from "infinity-forge";
import Editor from "@/OLD/components/Editor";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { pathologiesServices } from "@/OLD/services/pathologies.service";

import { LayoutDashboard } from "@/presentation";

export default function PatologiaEditarPage() {
  const [data, setData] = useState<{
    description?: string;
    definition?: string;
    active?: boolean;
  }>({});
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [startPage, setStartPage] = useState(false);

  const router = useRouter();

  const canEditPathology = useUserHasPermission("PAT02");

  const { createToast } = useToast();

  const fetchData = useCallback(() => {
    setStartPage(true);
    pathologiesServices
      .getById(router.query.subpage)
      .then((res) => {
        setData({
          definition: res.data.definition,
          description: res.data.description,
          active: res.data.active,
        });
        setBody(res.data.template);
      })
      .catch((err) => {
        createToast({ status: "error", message: "Erro ao carregar documento" });
      })
      .finally(() => setStartPage(false));
  }, []);

  useEffect(() => fetchData(), [fetchData]);

  const submitData = useCallback(() => {
    if (!(data && data.description && data.description.length > 0)) {
      return createToast({ status: "error", message: "Insira um titulo" });
    }
    if (!(data && data.definition && data.definition.length > 0)) {
      return createToast({ status: "error", message: "Insira uma descrição" });
    }
    if (!(body && body.length > 0)) {
      return createToast({
        status: "error",
        message: "Insira o corpo do documento",
      });
    }
    if (loading) return;
    setLoading(true);

    pathologiesServices
      .update(router.query.subpage, {
        ...data,
        template: body,
      })
      .then((res) => {
        createToast({
          status: "success",
          message: "Documento editado com sucesso",
        });

        router.back();
      })
      .catch((err) => {
        createToast({ status: "error", message: "Erro ao criar documento" });
      })
      .finally(() => setLoading(false));
  }, [loading, data, body, router]);

  return (
    <LayoutDashboard>
      {!canEditPathology || canEditPathology === "loading" ? (
        <AccessDenied loading={canEditPathology} />
      ) : (
        <div className="uk-container uk-padding">
          <div className="uk-flex uk-flex-between uk-flex-middle">
            <h3 className="uk-margin-remove">Editar patologia</h3>
          </div>
          {startPage ? (
            <div className="uk-flex uk-flex-center">
              <Spin spinning size="large" />{" "}
            </div>
          ) : (
            <div className="uk-card uk-card-default uk-card-body uk-margin-top">
              <div className="uk-margin-small">
                <label>Ativo</label>
                <select
                  className="uk-select"
                  value={String(data?.active)}
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
                <label>Descrição</label>
                <textarea
                  className="uk-textarea"
                  placeholder="Descrição do documento"
                  value={data?.definition}
                  onChange={(e) =>
                    setData({
                      ...data,
                      definition: e.target.value,
                    })
                  }
                />
              </div>
              <div className="uk-margin-small">
                <label>Conteúdo</label>
                <Editor editorState={body} setEditorState={setBody} />
              </div>
              <div className="uk-margin-top">
                <Button
                  onClick={submitData}
                  text={loading ? "Salvando..." : "Salvar"}
                />
                <Button onClick={() => router.back()} text="Voltar" />
              </div>
            </div>
          )}
        </div>
      )}
    </LayoutDashboard>
  );
}
