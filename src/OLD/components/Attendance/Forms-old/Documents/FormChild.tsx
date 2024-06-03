// @ts-nocheck
// Core
import React, { memo, useState, useEffect } from "react";

// Services
import { documentServices } from "@/OLD/services/document.service";
import { timelineService } from "@/OLD/services/timeline.service";

// Components
import { Button, Select, AutoComplete, Popconfirm } from "antd";
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";
const { Option } = Select;

// Utils
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

function FormChild({
  document,
  allDocuments,
  body,
  setBody,
  loading,
  submit,
  setDocument,
  modal,
  setVisible,
  replaceText,
  print,
  remove,
  updateData
}) {
  const [documentSearch, setDocumentSearch] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    document &&
      setDocumentSearch(
        allDocuments?.find((doc) => document?.id === doc?.id)?.title
      );
  }, [document]);

  useEffect(() => {
    if (!modal && document?.type === "pdf") {
      timelineService
        .generateS3Arquive({ key: body })
        .then((res) => setPdfUrl(res.data.link));
    }
  }, [modal, document, body]);

  sortItems(allDocuments, "title");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div>
        <label>Documento</label>
        <AutoComplete
          className="uk-width-1-1"
          required
          value={documentSearch}
          options={allDocuments.map((document) => ({
            ...document,
            value: `${document?.title} - ${
              document?.type === "text" ? "(Texto)" : "(Pdf)"
            }`
          }))}
          onChange={(e) => {
            setDocumentSearch(e);
          }}
          onSelect={(_, opt) => {
            replaceText(opt?.id, opt?.description);
            setDocument(opt);
            if (opt?.type === "pdf") {
              documentServices
                .renderPdf(opt?.id)
                .then((res) =>
                  setPdfUrl(
                    process.env.NEXT_PUBLIC_API + "/uploads/" + res?.data?.url
                  )
                );
            }
          }}
          filterOption={(val, opt) =>
            normalizeStr(opt?.title.toUpperCase()).includes(
              normalizeStr(val.toUpperCase())
            )
          }
        />
      </div>
      {document?.type === "pdf" ? (
        <div className="uk-margin-top">
          <a href={`${pdfUrl}`} target="_blank">
            {document?.file_name}
          </a>
        </div>
      ) : (
        <div className="uk-margin-top">
          <Editor editorState={body} setEditorState={setBody} value={body} />
        </div>
      )}
      <div className="uk-flex uk-flex-around uk-margin-top">
        {document?.type !== "pdf" && (
          <Print
            triggerComponent={<Button>Imprimir</Button>}
            content={body}
            title={
              allDocuments?.find((item) => item.id === document?.id)?.title
            }
            onBeforePrint={() => {
              if (print) {
                submit();
              }
            }}
          />
        )}
        {modal ? (
          <>
            <Button type="primary" htmlType="submit" loading={loading}>
              Salvar
            </Button>
            <Button onClick={() => setVisible(false)}>Cancelar</Button>
          </>
        ) : (
          <div className="uk-flex uk-flex-right">
            <Popconfirm
              title="Deseja remover este registro?"
              onConfirm={() => remove()}
            >
              <Button
                htmlType="button"
                type="danger"
                className="uk-margin-small-right"
              >
                Excluir
              </Button>
            </Popconfirm>
            <Button htmlType="submit" type="primary">
              Atualizar
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default FormChild;
