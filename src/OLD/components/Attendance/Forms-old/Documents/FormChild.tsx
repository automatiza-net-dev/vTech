// Core
import React, { useState, useEffect } from "react";

// Services
import { documentServices } from "@/OLD/services/document.service";
import { timelineService } from "@/OLD/services/timeline.service";

// Components
import { Popconfirm } from "antd";
import { Button } from "infinity-forge";
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";

// Utils
import { sortItems } from "@/OLD/utils/sortItems";
import { FormHandler, Select } from "infinity-forge";
import moment from "moment";

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
  registerPrint,
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
    <FormHandler isStickyButtons>
      <div>
        <label>Documento</label>
        {allDocuments && allDocuments.length > 0 && (
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
                      process.env.NEXT_PUBLIC_API + "/uploads/" + res?.data?.url
                    )
                  );
              }
            }}
          />
        )}
      </div>
      {document?.type === "pdf" ? (
        <div className="uk-margin-top">
          <a href={`${pdfUrl}`} target="_blank">
            {document?.file_name}
          </a>
        </div>
      ) : (
        <div
          className="uk-margin-top"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <Editor editorState={body} setEditorState={setBody} value={body} />
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        {document?.type !== "pdf" && (
          <Print
            triggerComponent={
              <Button text="Imprimir" style={{ marginRight: "10px" }} />
            }
            content={body}
            title={
              allDocuments?.find((item) => item.id === document?.id)?.title
            }
            onBeforePrint={() => {
              if (print) {
                submit();
                registerPrint && registerPrint();
              }
            }}
          />
        )}
        {modal ? (
          <>
            <Button
              onClick={submit}
              loading={loading}
              text="Salvar"
              style={{ marginRight: "10px" }}
            />

            <Button
              onClick={() => setVisible(false)}
              text="Cancelar"
              type="button"
              style={{ backgroundColor: "#ff7b5a" }}
            />
          </>
        ) : (
          <>
            <Button
              loading={loading}
              onClick={submit}
              text="Atualizar"
              style={{ marginRight: "10px" }}
            />
            <Popconfirm
              title="Deseja remover este registro?"
              onConfirm={() => remove()}
            >
              <Button
                loading={loading}
                type="button"
                text="Excluir"
                style={{ backgroundColor: "#ff7b5a" }}
              />
            </Popconfirm>
          </>
        )}
      </div>

      {updateData?.timeline_info?.print && (
        <div style={{ marginTop: "20px" }}>
          <strong>
            Impresso por {updateData?.timeline_info?.print?.user_name} em{" "}
            {moment(updateData?.timeline_info?.print.date).format("DD/MM/YYYY")}
          </strong>
        </div>
      )}
    </FormHandler>
  );
}

export default FormChild;
