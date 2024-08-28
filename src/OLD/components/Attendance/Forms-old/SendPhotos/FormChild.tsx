// @ts-nocheck
// Core
import React from "react";

// Icons
import { PlusOutline } from "styled-icons/evaicons-outline";

// Components
import { Button, FormHandler } from "infinity-forge";
import { NewAttachments } from "@/presentation";
import { Upload, Input, Select, Popconfirm } from "antd";

const { Option } = Select;
const { TextArea } = Input;

function FormChild({
  data,
  setData,
  beforeUpload,
  loading,
  fileList,
  setFileList,
  submit,
  setVisible,
  modal,
  setPhotosVisible,
  remove,
}) {
  const systemName = process.env.clientName;

  return (
    <FormHandler isStickyButtons>
      {systemName !== "LiftOne" ? (
        <div>
          <label>Titulo</label>
          <Input
            value={data?.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
      ) : (
        <div>
          <label>Tipo</label>
          <Select
            className="uk-width-1-1"
            value={data?.title}
            onChange={(val) => setData({ ...data, title: val })}
          >
            <Option value="avaliacao">Fotos avaliação</Option>
            <Option value="antes">Fotos do antes</Option>
            <Option value="depois">Fotos do depois</Option>
            <Option value="outras">Outras Fotos</Option>
          </Select>
        </div>
      )}
      <div className="uk-margin-top">
        <label>Observações</label>
        <TextArea
          value={data?.note}
          onChange={(e) => setData({ ...data, note: e.target.value })}
        />
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-top">
        <div className="uk-flex uk-flex-middle uk-margin-top">
          {modal && (
            <Upload
              name="pet-photos"
              className="avatar-uploader uk-text-center"
              multiple={true}
              beforeUpload={beforeUpload}
              showUploadList={false}
              fileList={fileList}
              onChange={(info) => {
                setFileList(info.fileList);
              }}
            >
              <Button
                type="button"
                style={{ marginRight: "10px", marginBottom: "5px" }}
                text={
                  <>
                    {" "}
                    <PlusOutline size={15} className="upload-icon" /> Adicionar
                    anexos
                  </>
                }
              />
            </Upload>
          )}
          <div style={{ display: "flex" }}>
            <Button
              type="button"
              style={{ marginRight: "10px", marginBottom: "5px" }}
              onClick={() => setPhotosVisible(true)}
              text={"Visualizar arquivos anexados"}
            />
            {!modal && <NewAttachments setFileList={setFileList} />}
          </div>
        </div>
      </div>
      <hr />
      <footer className="uk-flex uk-flex-right">
        <div className="uk-margin-top uk-flex">
          <Button
            onClick={submit}
            loading={loading}
            className="uk-margin-small-right"
            text={"salvar"}
          />

          {modal && (
            <Button
              onClick={() => setVisible(false)}
              text={"Cancelar"}
              style={{ marginRight: "10px", backgroundColor: "#ff7b5a" }}
            />
          )}

          {!modal && (
            <Popconfirm
              title="Deseja remover este registro?"
              onConfirm={() => remove()}
              loading={loading}
            >
              <Button
                text={"Excluir"}
                type="button"
                style={{ backgroundColor: "#ff7b5a" }}
              />
            </Popconfirm>
          )}
        </div>
      </footer>
    </FormHandler>
  );
}

export default FormChild;
