// @ts-nocheck
// Core
import React, { memo } from "react";

// Icons
import { PlusOutline } from "styled-icons/evaicons-outline";

// Components
import { Button as ButtonA } from "@/OLD/components/mini-components/Button";
import { Upload, Button, Input, Popconfirm } from "antd";
import Print from "@/OLD/components/mini-components/Print";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
const { TextArea } = Input;

// Utils
import moment from "moment";

const FormChild = memo(function FormChild({
  data,
  setData,
  setVisible,
  beforeUpload,
  fileList,
  loading,
  submit,
  setFileList,
  modal,
  setPhotosOpen,
  print,
  patient,
  remove
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div>
        <div>
          <div className="uk-flex uk-flex-between">
            <div className="uk-width-1-2">
              <label>Data Observação</label>
              <br />
              <DateTimeField
                className=""
                slotProps={{ textField: { variant: "standard" } }}
                value={data?.date}
                onChange={(val) => {
                  setData({ ...data, date: val });
                }}
              />
            </div>
            {!modal && (
              <div className="uk-width-1-3">
                <label>Data Lançamento da observação</label>
                <DateTimeField
                  disabled={true}
                  value={moment(data?.updatedAt, "YYYY-MM-DD[T]HH:mm:ss")}
                  slotProps={{ textField: { variant: "standard" } }}
                />
              </div>
            )}
          </div>
          <div className="uk-margin-small-top">
            <label>Resumo</label>
            <Input
              onChange={(e) => setData({ ...data, resume: e.target.value })}
              value={data?.resume}
            />
          </div>
          <div className="uk-margin-small-top">
            <label>Observação</label>
            <TextArea
              required
              autoSize={{ minRows: 10 }}
              value={data?.observations}
              onChange={(e) =>
                setData({ ...data, observations: e.target.value })
              }
            />
          </div>
        </div>
        <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-top">
          <label>Anexos</label>
          <div className="uk-flex">
            <ButtonA className="uk-link" onClick={() => setPhotosOpen(true)}>
              Visualizar fotos anexadas
            </ButtonA>
            <Upload
              name="pet-photos"
              className="avatar-uploader uk-text-center"
              beforeUpload={beforeUpload}
              showUploadList={false}
              fileList={fileList}
              onChange={(info) => {
                setFileList(info.fileList);
              }}
            >
              <ButtonA>
                <PlusOutline size={15} className="upload-icon" /> Adicionar
                anexos
              </ButtonA>
            </Upload>
          </div>
        </div>
      </div>
      <div>
        <footer className="uk-flex uk-flex-center">
          <Print
            patient={patient}
            triggerComponent={
              <Button className="uk-margin-top uk-margin-small-right">
                Imprimir
              </Button>
            }
            content={data?.observations}
            title={"Observações"}
            string={true}
            onBeforePrint={() => print()}
          />
          {modal ? (
            <div className="uk-margin-top uk-flex uk-flex-between">
              <Button
                onClick={() => setVisible(false)}
                className="uk-margin-small-right"
              >
                {" "}
                Cancelar{" "}
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                salvar
              </Button>
            </div>
          ) : (
            <div className="uk-flex uk-flex-right uk-margin-top">
              <Button htmlType="submit" type="primary">
                Atualizar
              </Button>
              <Popconfirm
                title="Deseja remover este registro?"
                onConfirm={() => remove()}
              >
                <Button
                  htmlType="button"
                  type="danger"
                  className="uk-margin-small-left"
                >
                  Excluir
                </Button>
              </Popconfirm>
            </div>
          )}
        </footer>
      </div>
    </form>
  );
});

export default FormChild;
