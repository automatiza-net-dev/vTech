import React, { useState, useCallback } from "react";

import { useRouter } from "next/router";

import { notification } from "antd";

import { Button } from "infinity-forge";
import Editor from "@/OLD/components/Editor";
import AccessDenied from "@/OLD/components/AccessDenied";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { pathologiesServices } from "@/OLD/services/pathologies.service";

import { LayoutDashboard } from "@/presentation";

export default function PathologyCreatePaage() {
  const [data, setData] = useState<{
    description?: string;
    definition?: string;
  }>({});
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const canCreatePathology = useUserHasPermission("PAT01");

  const submitData = useCallback(() => {
    if (!(data && data.description && data.description.length > 0)) {
      return notification.error({
        message: "Insira um titulo",
      });
    }
    if (!(data && data.definition && data.definition.length > 0)) {
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

    pathologiesServices
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
      {!canCreatePathology || canCreatePathology === "loading" ? (
        <AccessDenied loading={canCreatePathology} />
      ) : (
        <div className="uk-container uk-padding">
          <div className="uk-flex uk-flex-between uk-flex-middle">
            <h3 className="uk-margin-remove">Cadastrar patologia</h3>
          </div>
          <div className="uk-card uk-card-default uk-card-body uk-margin-top">
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
                className="uk-button uk-button-primary"
                onClick={submitData}
                text={loading ? "Salvando..." : "Salvar"}
              />

              <Button onClick={() => router.back()} text="Voltar" />
            </div>
          </div>
        </div>
      )}
    </LayoutDashboard>
  );
}
