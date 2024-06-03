// @ts-nocheck
// Core
import React from "react";

// Icons
import { PlusOutline } from "styled-icons/evaicons-outline";

// Components
import { Button, Upload, Input, Select, Popconfirm } from "antd";
import { Button as ButtonA } from "@/OLD/components/mini-components/Button";
const { TextArea } = Input;
const { Option } = Select;

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
  remove
}) {

  const systemName = process.env.clientName;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
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
              <ButtonA>
                <PlusOutline size={15} className="upload-icon" /> Adicionar
                anexos
              </ButtonA>
            </Upload>
          )}
          <div>
            <ButtonA onClick={() => setPhotosVisible(true)}>
              Visualizar arquivos anexados
            </ButtonA>
          </div>
        </div>
      </div>
      <footer className="uk-flex uk-flex-right">
        <div className="uk-margin-top uk-flex">
          {!modal && (
            <Popconfirm
              title="Deseja remover este registro?"
              onConfirm={() => remove()}
              loading={loading}
            >
              <Button
                htmlType="button"
                type="danger"
                className="uk-margin-small-right"
              >
                Excluir
              </Button>
            </Popconfirm>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="uk-margin-small-right"
          >
            salvar
          </Button>
          <Button onClick={() => setVisible(false)}> Cancelar </Button>
        </div>
      </footer>
    </form>
  );
};

export default FormChild;
