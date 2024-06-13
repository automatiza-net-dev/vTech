// Core
import React, { useState, useEffect } from "react";

// Services
import { documentServices } from "@/OLD/services/document.service";
import { timelineService } from "@/OLD/services/timeline.service";

// Components
import { Button, Popconfirm } from "antd";
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";
import { FormHandler, Select } from "infinity-forge";

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
  updateData,
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
        {allDocuments && allDocuments.length > 0 && (
          <FormHandler>
            <Select
              menuPlacement="bottom"
              name="document"
              options={allDocuments.map((document) => ({
                label: document?.title,
                value: document?.title,
              }))}
              value={document?.title}
              disabled={!modal}
              onlyOneValue
              onChangeSelect={async (value) => {
                const optionSelected = allDocuments?.find(
                  (document) => document.title === value
                );

                await replaceText(
                  optionSelected?.id,
                  optionSelected?.description
                );

                setDocument(optionSelected);
                if (optionSelected?.type === "pdf") {
                  documentServices
                    .renderPdf(optionSelected?.id)
                    .then((res) =>
                      setPdfUrl(
                        process.env.NEXT_PUBLIC_API +
                          "/uploads/" +
                          res?.data?.url
                      )
                    );
                }
              }}
            />
          </FormHandler>
        )}
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
                loading={loading}
                htmlType="button"
                className="uk-margin-small-right"
              >
                Excluir
              </Button>
            </Popconfirm>
            <Button loading={loading} htmlType="submit" type="primary">
              Atualizar
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}

export default FormChild;
