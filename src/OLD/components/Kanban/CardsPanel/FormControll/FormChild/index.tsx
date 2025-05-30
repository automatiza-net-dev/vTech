import { memo, useState } from "react";

import { Input, Button, Select, AutoComplete } from "antd";
const { Option } = Select;
const { TextArea } = Input;

import { normalizeStr } from "@/OLD/utils/normalizeString";

import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";
import {
  api,
  formatNumberToCurrency,
  FormHandler,
  Select as SelectInfinityForge,
} from "infinity-forge";
import moment from "moment";
import { useQuery } from "@/presentation/use-query/use-query";

const FormChild = memo(function ({
  data,
  setData,
  submit,
  formData,
  close,
  options,
}: any) {
  const opportunityMovements = useQuery({
    queryKey:
      ["search_from_clients",
      formData?.op?.id,
      formData?.op?.contact?.id,
      formData?.op?.client?.id],
    queryFn: async () => {
      const response = await api({
        url: "opportunity-movements/search-from-clients",
        method: "get",
        body: {
          client: formData?.op?.contact?.id,
          patient: formData?.op?.client?.id,
          type: "bill",
        },
      });

      return response;
    },
  });

  const opportunitiesList =
    opportunityMovements?.data?.map((op) => {
      return {
        ...op,
        label:
          op?.tag +
          " - " +
          moment(op?.bill_date).format("DD/MM/YYYY") +
          " - " +
          formatNumberToCurrency(op?.total_value || 0),
        value: op?.id,
      };
    }) || [];

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
      onSubmit={async (e) => {
        e.preventDefault();
       submit();
      }}
    >
      {headerRender()}
      {formData?.form === "gain" && (
        <div className="uk-margin-small-top">
          <h4>
            Valor da oportunidade:{" "}
            {formatNumberToCurrency(formData?.op?.value || 0)}
          </h4>
        </div>
      )}

      <FormHandler>
        <SelectInfinityForge
          onChangeInput={(value) =>
            setData((oldState) => {
              const selectValue = value as string[];

              const items = selectValue.map((item) => {
                const findOptionSelected = opportunitiesList?.find(
                  (op) => op?.id === item
                );

                return {
                  opportunityId: formData?.op?.id,
                  movementId: item,
                  type: findOptionSelected?.type,
                };
              });

              return { ...oldState, items };
            })
          }
          isMultiple
          label="Selecionar Vendas Relacionadas"
          name="select_opportunity"
          placeholder="Selecione uma venda"
          loading={opportunityMovements.isFetching}
          options={opportunitiesList}
        />
      </FormHandler>

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
              normalizeStr(String(opt?.value)?.toUpperCase()).includes(
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
