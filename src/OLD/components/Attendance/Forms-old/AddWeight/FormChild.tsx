// @ts-nocheck
// Core
import React, { memo } from "react";

// Components
import { Input, Button } from "antd";
const { TextArea } = Input;

const dynamicRegex = (type) => {
  if (type === "Pressão arterial") {
    return /^[0-9/:-]*$/;
  } else return /^[0-9:,]*$/;
};

function FormChild({
  data,
  setData,
  loading,
  modal,
  setVisible,
  submit,
  type,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div>
        <h4>{type}</h4>
        <label>{type === "Peso" ? `${type} (Kg)` : type}</label>
        <Input
          required
          type='number'
          value={data?.weight}
          onChange={(e) => {
            const inputValue = e.target.value;

            if (dynamicRegex(type).test(inputValue)) {
              setData({
                ...data,
                weight: inputValue,
              });
            }
          }}
        />
      </div>
      <div className="uk-margin-top">
        <label>Observações</label>
        <TextArea
          value={data?.observation}
          onChange={(e) => setData({ ...data, observation: e.target.value })}
        />
      </div>
      {modal ? (
        <footer className="uk-flex uk-flex-right">
          <div className="uk-margin-top uk-flex uk-flex-between uk-width-1-2">
            <Button htmlType="submit" type="primary" loading={loading}>
              Salvar
            </Button>
            <Button onClick={() => setVisible(false)}>Cancelar</Button>
          </div>
        </footer>
      ) : (
        <div className="uk-margin-large-top uk-flex uk-flex-right">
          <Button htmlType="submit" type="primary">
            Salvar
          </Button>
        </div>
      )}
    </form>
  );
}

export default FormChild;
