// @ts-nocheck
import { notification, Radio, Upload } from "antd";
import Editor from "@/OLD/components/Editor";
import { useRouter } from "next/router";
import React, { useState, useCallback } from "react";
import { documentServices } from "@/OLD/services/document.service";

// Hooks
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Components
import { Button as CustomButton } from "@/OLD/components/mini-components";
import LabelsPanel from "@/OLD/components/mini-components/LabelsPanel";
import AccessDenied from "@/OLD/components/AccessDenied";
const { Group } = Radio;

// Utils
import { permissionControl } from "@/OLD/utils/permissionsControlFake";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";

const DocumentCreate = React.memo(function DocumentCreate() {
  const router = useRouter();
  const [data, setData] = useState({ type: "text" });
  const [body, setBody] = useState();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(false);

  const canCreateDocument = useUserHasPermission("DOC01");

  const permissions = permissionControl("documentos");

  const beforeUpload = (file) => {
    //doc docx
    const extension = file?.name?.split(".");

    if (
      extension[extension?.length - 1] === "doc" ||
      extension[extension?.length - 1] === "docx"
    ) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return notification.error({
          message: "Você só pode upar arquivos até 2MB!",
        });
      }
    }

    return true;
  };

  const submitData = useCallback(() => {
    if (!permissions?.DOC1) {
      return notification.error({
        message: "Ação não permitida",
      });
    }

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
    if (!(body && body.length > 0) && data?.type === "text") {
      return notification.error({
        message: "Insira o corpo do documento",
      });
    }

    if (data?.type === "import" && !file) {
      return notification.error({
        message:
          "É necessário que seja adicionado um documento do tipo '.doc' ou '.docx'",
      });
    }
    if (loading) return;
    setLoading(true);

    if (data?.type !== "import") {
      documentServices
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
          setLoading(false);
          notification.error({
            message: "Erro ao criar documento",
          });
        });
    } else {
      const formData = new FormData();

      formData.append("description", data?.description);
      formData.append("title", data?.title);
      formData.append("header", "header");
      formData.append("file", file?.originFileObj);

      documentServices
        .createWithDoc(formData)
        .then((res) => {
          setLoading(false);
          notification.success({
            message: "Documento criado com sucesso",
          });
          router.back();
        })
        .catch((err) => {
          setLoading(false);
          notification.error({
            message: "Erro ao criar documento",
          });
        });
    }
  }, [loading, data, body, file]);

  return !canCreateDocument || canCreateDocument === "loading" ? (
    <AccessDenied loading={canCreateDocument} />
  ) : (
    <div className="uk-container uk-padding">
      <div className="uk-flex uk-flex-between uk-flex-middle">
        <h3 className="uk-margin-remove">Cadastrar documento</h3>
      </div>
      <div className="uk-card uk-card-default uk-card-body uk-margin-top">
        <div className="uk-width-1-1">
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
          <div>
            <label>Tipo</label>
            <br />
            <Group
              defaultValue={"text"}
              onChange={(e) => {
                setData((prv) => ({ ...prv, type: e.target.value }));
              }}
            >
              <Radio value="text">
                Escrever o texto (fazer texto manualmente)
              </Radio>
              <Radio value="import">Documento Word</Radio>
            </Group>
          </div>
          {data?.type === "text" && (
            <div className="uk-flex">
              <div className="uk-width-5-6">
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
                <div className="uk-margin-small">
                  <label>Conteúdo</label>
                  <Editor editorState={body} setEditorState={setBody} />
                </div>
              </div>
              <LabelsPanel body={body} setBody={setBody} />
            </div>
          )}
          {data?.type === "import" && (
            <div className="uk-margin-small-top">
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
              {!file ? (
                <Upload
                  multiple={false}
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  type=".doc, docx"
                  onChange={(info) => {
                    setFile(info.file);
                  }}
                >
                  <CustomButton>Importar arquivo word</CustomButton>
                </Upload>
              ) : (
                <div>
                  Arquivo:{" "}
                  <span className="uk-link">{file?.originFileObj?.name}</span>
                  &nbsp;
                  <DeleteTwoTone
                    twoToneColor="red"
                    onClick={() => setFile(false)}
                  />
                </div>
              )}
            </div>
          )}
          <div className="uk-margin-top">
            <CustomButton
              onClick={() => submitData()}
              classCallback="uk-margin-right"
            >
              {loading ? "Salvando..." : "Salvar"}
            </CustomButton>
            <CustomButton onClick={() => router.back()}>Voltar</CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DocumentCreate;
