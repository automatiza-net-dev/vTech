// @ts-nocheck
// Core
import React, { memo, useState, useEffect } from "react";

// Utils
import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

// Components
import { Input, Button, AutoComplete, Popconfirm, notification } from "antd";
const { TextArea } = Input;
import Editor from "@/OLD/components/Editor";
import Print from "@/OLD/components/mini-components/Print";

const FormChild = memo(function FormChild({
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
  patient
}) {
  const [pathologySearch, setPathologySearch] = useState("");

  useEffect(() => {
    data && setPathologySearch(data?.pathology);
  }, [data]);

  sortItems(allPathologies, "description");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (defaultProtocol === "") {
          return notification.warning({
            message: "Campo protocolo obrigatório"
          });
        }
        submit();
      }}
    >
      <div>
        <label>Patologia</label>
        <AutoComplete
          value={pathologySearch}
          className="uk-width-1-1"
          options={allPathologies.map((pathology) => ({
            ...pathology,
            value: pathology?.description
          }))}
          onChange={(val) => {
            setPathologySearch(val);
          }}
          onSelect={(val, opt) => {
            setPathologySearch(val);
            setData({
              ...data,
              pathology: opt?.description,
              description: opt?.definition
            });
            setDefaultProtocol(opt?.template);
          }}
          filterOption={(val, opt) =>
            normalizeStr(opt?.description?.toUpperCase()).includes(
              normalizeStr(val?.toUpperCase())
            )
          }
        />
      </div>
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
        {modal ? (
          <>
            <div className="uk-margin-top">
              <Button
                className="uk-margin-right"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                salvar
              </Button>
              <Button
                onClick={() => setVisible(false)}
                className="uk-margin-right"
              >
                {" "}
                Cancelar{" "}
              </Button>
            </div>
          </>
        ) : (
          <div className="uk-margin-top uk-flex uk-flex-right">
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
            <Button
              htmlType="submit"
              type="primary"
              className="uk-margin-small-right"
            >
              Atualizar
            </Button>
          </div>
        )}
        <Print
          patient={patient}
          triggerComponent={
            <Button className="uk-margin-top">Imprimir Laudo</Button>
          }
          content={defaultProtocol}
          title={data?.description}
          string={true}
          onBeforePrint={() => print()}
        />
      </footer>
    </form>
  );
});

export default FormChild;
