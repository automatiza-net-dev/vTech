// @ts-nocheck
import { useRouter } from "next/router";
import React, { useState, useCallback, useEffect } from "react";
import { documentServices } from "@/OLD/services/document.service";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Components
import { Button, useToast } from "infinity-forge";
import Editor from "@/OLD/components/Editor";
import { Spin, Upload } from "antd";
import LabelsPanel from "@/OLD/components/mini-components/LabelsPanel";
import AccessDenied from "@/OLD/components/AccessDenied";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";

// Utils
import { permissionControl } from "@/OLD/utils/permissionsControlFake";

function DocumentCreate() {
  const router = useRouter();
  const [data, setData] = useState();
  const [body, setBody] = useState();
  const [loading, setLoading] = useState(false);
  const [startPage, setStartPage] = useState(false);
  const [file, setFile] = useState(false);
  const [url, setUrl] = useState("");
  const [newFile, setNewFile] = useState(false);

  const permissions = permissionControl("documentos");

  const canEditDocument = useUserHasPermission("DOC02");

  const { createToast } = useToast();

  const fetchData = useCallback(() => {
    setStartPage(true);

    documentServices
      .getById(router.query.innerpage)
      .then((res) => {
        setData({
          description: res.data.description,
          title: res.data.title,
          active: res.data.active,
          type: res.data.type,
        });
        setBody(res.data.template);
        res?.data?.file_name &&
          setFile({
            originFileObj: {
              name: res.data?.file_name,
            },
            url: "uploads/" + res.data?.source_file,
          });
      })
      .catch((err) => {
        createToast({ status: "error", message: "Erro ao carregar documento" });
      })
      .finally(() => setStartPage(false));
  }, []);

  useEffect(() => fetchData(), [fetchData]);

  useEffect(() => {
    if (data?.type === "pdf") {
      documentServices
        .renderPdf(router.query.innerpage)
        .then((res) =>
          setUrl("/uploads/" + res?.data?.url)
        );
    }
  }, [data, router]);

  const beforeUpload = (file) => {
    //doc docx
    const extension = file?.name?.split(".");

    if (
      extension[extension?.length - 1] === "doc" ||
      extension[extension?.length - 1] === "docx"
    ) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return createToast({
          status: "error",
          message: "Você só pode upar arquivos até 2MB!",
        });
      }
    }

    setNewFile(true);
    return true;
  };

  const submitData = useCallback(() => {
    if (!permissions?.DOC2) {
      return createToast({ status: "error", message: "Ação não permitida" });
    }

    if (!(data && data.title && data.title.length > 0)) {
      return createToast({ status: "error", message: "Insira um titulo" });
    }
    if (!(data && data.description && data.description.length > 0)) {
      return createToast({ status: "error", message: "Insira uma descrição" });
    }
    if (!(body && body.length > 0) && data?.type !== "pdf") {
      return createToast({
        status: "error",
        message: "Insira o corpo do documento",
      });
    }

    if (data?.type === "pdf" && !file) {
      return createToast({
        status: "error",
        message:
          "É necessário que seja adicionado um documento do tipo '.doc' ou '.docx'",
      });
    }
    if (loading) return;
    setLoading(true);

    if (data?.type !== "pdf") {
      documentServices
        .update(router.query.innerpage, {
          header: "header",
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
    } else {
      const formData = new FormData();

      formData.append("description", data?.description);
      formData.append("title", data?.title);
      formData.append("header", "header");
      newFile && formData.append("file", file?.originFileObj);
      formData.append("active", data?.active);
      formData.append("type", data?.type);

      documentServices
        .updateWithDoc(router.query.innerpage, formData)
        .then((res) => {
          setLoading(false);

          createToast({
            status: "success",
            message: "Documento criado com sucesso",
          });
          router.back();
        })
        .catch((err) => {
          setLoading(false);
          err?.response?.data?.errors?.length > 0 &&
            createToast({
              status: "error",
              message: err?.response?.data?.errors[0]?.message,
            });
        });
    }
  }, [loading, data, body, router, file, newFile]);

  return !canEditDocument || canEditDocument === "loading" ? (
    <AccessDenied loading={canEditDocument} />
  ) : (
    <div className="uk-container uk-padding">
      <div className="uk-flex uk-flex-between uk-flex-middle">
        <h3 className="uk-margin-remove">Editar documento</h3>
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
                type="text"
                className="uk-select"
                value={data?.active}
                onChange={(e) =>
                  setData({
                    ...data,
                    active: e.target.value,
                  })
                }
              >
                <option value={true}>Ativo</option>
                <option value={false}>Inativo</option>
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
                type="text"
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
            {data?.type === "pdf" &&
              (!file ? (
                <Upload
                  multiple={false}
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  type=".doc, docx"
                  onChange={(info) => {
                    setFile(info.file);
                  }}
                >
                  <Button text="Importar arquivo word" />
                </Upload>
              ) : (
                <div>
                  Arquivo:{" "}
                  <span className="uk-link">
                    <a href={url} target="_blank">
                      {file?.originFileObj?.name}
                    </a>
                  </span>
                  &nbsp;
                  <DeleteTwoTone
                    twoToneColor="red"
                    onClick={() => setFile(false)}
                  />
                </div>
              ))}
            {data?.type !== "pdf" && (
              <>
                <div className="uk-margin-small">
                  <label>Conteúdo</label>
                  <Editor editorState={body} setEditorState={setBody} />
                </div>
              </>
            )}
            <div
              className="uk-margin-top"
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <Button
                onClick={submitData}
                text={loading ? "Salvando..." : "Salvar"}
              />

              <Button onClick={() => router.back()} text="Voltar" />
            </div>
          </div>
          {data?.type !== "pdf" && (
            <LabelsPanel body={body} setBody={setBody} />
          )}
        </div>
      )}
    </div>
  );
}

export default DocumentCreate;
