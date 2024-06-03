// @ts-nocheck
import { memo } from "react";

import { Input, Button, Select, AutoComplete } from "antd";
const { Option } = Select;
const { TextArea } = Input;

import { normalizeStr } from "@/OLD/utils/normalizeString";

import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";

const FormChild = memo(function ({
  data,
  setData,
  submit,
  formData,
  close,
  options,
}) {
  const headerRender = () => {
    if (formData?.form === "gain" || formData?.form === "loss") {
      return (
        <>
          <div className="uk-flex uk-flex-between">
            <div className="uk-margin-small-right uk-width-2-3">
              <label>Cliente</label>
              <Input
                value={
                  formData?.op?.client?.name || formData?.op?.contact?.name
                }
                disabled
              />
            </div>
            <div>
              <label>Telefone</label>
              <Input
                value={
                  formData?.op?.contact?.cellphone ||
                  formData?.op?.contact?.tutor?.cellphone
                }
                disabled
              />
            </div>
          </div>
          <div className="uk-margin-small-top">
            <label>Título oportunidade</label>
            <Input value={formData?.op?.description} disabled />
          </div>
        </>
      );
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {headerRender()}
      {formData?.form === "gain" && (
        <div className="uk-margin-small-top">
          <h4>
            Valor da oportunidade: {currencyFormatter(formData?.op?.value)}
          </h4>
        </div>
      )}
      {formData?.actualField && (
        <div>
          <label>{formData?.actualField}</label>
          <Input disabled value={formData?.actualValue} />
        </div>
      )}
      {formData?.currencyField && (
        <div>
          <label>{formData?.currencyField}</label>
          <Input
            value={data?.currencyValue}
            onChange={(e) =>
              setData({
                ...data,
                currencyValue: currencyFormatter(
                  convertIntlCurrency(e.target.value)
                ),
              })
            }
          />
        </div>
      )}
      {formData?.completeField && (
        <div className="uk-width-1-1 uk-margin-small-top">
          <label>{formData?.completeField}</label>
          <AutoComplete
            className="uk-width-1-1"
            options={options}
            value={data?.collabName}
            onChange={(val) => setData({ ...data, collabName: val })}
            onSelect={(_, opt) => {
              setData({ ...data, completeId: opt?.id, collabName: opt?.value });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.value.toUpperCase()).includes(
                normalizeStr(val?.toUpperCase())
              )
            }
          />
        </div>
      )}
      {formData?.selectField && (
        <div className="uk-margin-small-top">
          <label>{formData?.selectField}</label>
          <Select
            className="uk-width-1-1"
            value={data?.selectedId}
            onChange={(val) => setData({ ...data, selectedId: val })}
          >
            {options?.length > 0 &&
              options.map((option) => (
                <Option value={option?.id} key={option?.id}>
                  {option?.description || option?.reason}
                </Option>
              ))}
          </Select>
        </div>
      )}
      {formData?.areaField && (
        <div className="uk-margin-small-top">
          <label>{formData?.areaField}</label>
          <TextArea
            value={data?.areaValue}
            onChange={(e) => setData({ ...data, areaValue: e.target.value })}
          />
        </div>
      )}
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Button type="primary" className="uk-margin-right" htmlType="submit">
          Salvar
        </Button>
        <Button onClick={() => close()}>Cancelar</Button>
      </footer>
    </form>
  );
});

export default FormChild;
