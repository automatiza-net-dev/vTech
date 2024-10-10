// @ts-nocheck
import React, { useState, useEffect } from "react";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

import { Input, AutoComplete, Popconfirm } from "antd";
import { Select, FormHandler, createToast, Button } from "infinity-forge";
const { TextArea } = Input;
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";

function FormChild({
  data,
  setData,
  allPathologies,
  loading,
  submit,
  modal,
  defaultProtocol,
  setDefaultProtocol,
  setVisible,
  print,
  remove,
  patient,
}) {
  const [pathologySearch, setPathologySearch] = useState("");

  useEffect(() => {
    data && setPathologySearch(data?.pathology);
  }, [data]);

  sortItems(allPathologies, "description");

  return (
    <FormHandler isStickyButtons>
      {modal ? (
        <>
          <div>
            <label>Patologia</label>
            {allPathologies && allPathologies.length > 0 && (
              <FormHandler>
                <Select
                  menuPlacement="bottom"
                  name="exam"
                  options={allPathologies.map((pathology) => ({
                    label: pathology?.description,
                    value: pathology?.id,
                  }))}
                  disabled={!modal}
                  onlyOneValue
                  onChangeInput={async (value) => {
                    const selectedPathology = allPathologies.find(
                      (pathology) => pathology.id === value
                    );

                    setData({
                      ...data,
                      pathology: selectedPathology?.description,
                      description: selectedPathology?.definition,
                    });
                    setDefaultProtocol(selectedPathology?.template);
                  }}
                />
              </FormHandler>
            )}
          </div>
        </>
      ) : (
        <h3>{pathologySearch}</h3>
      )}
      <div className="uk-margin-top">
        <label>Descrição</label>
        <TextArea
          required
          value={data?.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </div>
      <div className="uk-margin-top">
        <label className="uk-text-muted"> Protocolo padrão </label>
        <Editor
          editorState={defaultProtocol}
          setEditorState={setDefaultProtocol}
        />
      </div>
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Print
          patient={patient}
          triggerComponent={
            <Button
              text="Imprimir Laudo"
              type="button"
              style={{ marginRight: "10px" }}
              loading={loading}
            />
          }
          content={defaultProtocol}
          title={data?.description}
          string={true}
          onBeforePrint={() => print()}
        />
        {modal ? (
          <>
            <Button
              onClick={() => {
                if (defaultProtocol === "") {
                  return createToast({
                    message: "Campo protocolo obrigatório",
                    status: "error",
                  });
                }
                submit();
              }}
              loading={loading}
              text="Salvar"
              style={{ marginRight: "10px" }}
            />

            <Button
              onClick={() => setVisible(false)}
              type="button"
              text="Cancelar"
              style={{ backgroundColor: "#ff7b5a", marginRight: "10px" }}
            />
          </>
        ) : (
          <>
            <Button
              loading={loading}
              onClick={() => {
                if (defaultProtocol === "") {
                  return createToast({
                    message: "Campo protocolo obrigatório",
                    status: "error",
                  });
                }
                submit();
              }}
              text="Atualizar"
              style={{ marginRight: "10px" }}
            />

            <Popconfirm
              title="Deseja remover este registro?"
              onConfirm={() => remove()}
            >
              <Button
                type="button"
                style={{ backgroundColor: "#ff7b5a" }}
                text="Excluir"
              />
            </Popconfirm>
          </>
        )}
      </footer>
    </FormHandler>
  );
}

export default FormChild;
