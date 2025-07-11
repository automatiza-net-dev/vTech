// @ts-nocheck
// Core
import React, { memo } from "react";

// Icons
import { PlusOutline } from "styled-icons/evaicons-outline";

// Components
import { Button, FormHandler } from "infinity-forge";
import { Upload, Input, Popconfirm } from "antd";
import Print from "@/OLD/components/mini-components/Print";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
const { TextArea } = Input;

// Utils
import moment from "moment";

function FormChild({
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
  remove,
}: any) {
  return (
    <FormHandler isStickyButtons disableEnterKeySubmitForm>
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
              <Button
                type="button"
                style={{ marginRight: "10px" }}
                text={
                  <>
                    <PlusOutline size={15} className="upload-icon" />
                    Adicionar anexos
                  </>
                }
              />
            </Upload>
            <Button
              type="button"
              onClick={() => setPhotosOpen(true)}
              text="Visualizar fotos anexadas"
            />
          </div>
        </div>
      </div>
      <div>
        <footer>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Print
              patient={patient.data}
              triggerComponent={
                <Button
                  style={{ marginRight: "10px" }}
                  text="Imprimir"
                  type="button"
                />
              }
              content={data?.observations}
              title={"Observações"}
              string={true}
              onBeforePrint={() => print()}
            />
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
                  style={{ backgroundColor: "#ff7b5a" }}
                  text="Cancelar"
                />
              </>
            ) : (
              <div className="uk-flex uk-flex-right">
                <Button
                  onClick={submit}
                  loading={loading}
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
                    loading={loading}
                    text="Excluir"
                  />
                </Popconfirm>
              </div>
            )}
          </div>
        </footer>
      </div>
    </FormHandler>
  );
}

export default FormChild;
