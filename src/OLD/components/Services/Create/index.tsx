import React from "react";

import { useSubgroups } from "@/OLD/hooks/useSubgroup";

import {
  FormHandler,
  Tab,
  useToast,
  Input,
  Select,
  InputSwitch,
  api,
  schema,
  Textarea,
  InputCurrency,
} from "infinity-forge";

import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { useTaxationGroups } from "@/OLD/hooks/useTaxationGroups";

export default function Create({ setVisible }) {
  const { subgroups } = useSubgroups();
  const { createToast } = useToast();
  const { taxationGroups } = useTaxationGroups();

  return (
    <FormHandler
      isStickyButtons
      schema={{
        taxationGroupId: schema.required(),
        subgroupId: schema.required(),
        price: schema.required(),
        serviceType: schema.required(),
        description: schema.required(),
      }}
      onSucess={async (formData) => {
        await api({
          url: "services",
          method: "post",
          body: {
            ...formData,
            price: {
              ...formData,
              price: formData.price
                ? convertIntlCurrency(formData.price)
                : null,
              maximumDiscountValue: formData?.maximumDiscountValue
                ? convertIntlCurrency(formData?.maximumDiscountValue)
                : null,
              costPrice: formData?.costPrice
                ? convertIntlCurrency(formData?.costPrice)
                : null,
            },
          },
        });

        createToast({
          message: "Serviço cadastrado com sucesso!",
          status: "success",
        });

        setVisible(false);
      }}
      disableEnterKeySubmitForm
      cleanFieldsOnSubmit={false}
      button={{ text: "Salvar" }}
    >
      <section className="form-container uk-padding">
        <div className="uk-flex" style={{ gap: 20 }}>
          <div className="uk-width-1-1">
            <Input name="description" label="* Descrição" />
          </div>

          <div className="uk-width-1-1">
            <Input name="referenceCode" label="Código de referência" />
          </div>

          <div className="uk-width-1-1">
            <Select
              label="* Subgrupo"
              name="subgroupId"
              onlyOneValue
              options={
                subgroups?.map((item) => ({
                  label: item?.description,
                  value: item?.id,
                })) || []
              }
            />
          </div>

          <div className="uk-width-1-1">
            <Select
              label="* Tipo Serviço"
              name="serviceType"
              onlyOneValue
              options={[
                { label: "Serviço", value: "service" },
                { label: "Exame", value: "exam" },
              ]}
            />
          </div>
        </div>

        <div className="uk-width-1-1">
          <InputSwitch name="courtesy" label="Cortesia" />
        </div>

        <Tab
          mapAllTabs
          tabs={[
            {
              title: "Dados cadastrais",
              key: "data",
              content: () => {
                return (
                  <section>
                    <div className="row">
                      <Select
                        label="* Grupo de imposto"
                        name="taxationGroupId"
                        onlyOneValue
                        options={
                          taxationGroups?.map((item) => ({
                            label: item?.name,
                            value: item?.id,
                          })) || []
                        }
                      />

                      <Input name="serviceCode" label="Código de Serviço" />

                      <Input name="codigoNbs" label="Código NBS" />
                    </div>

                    <div>
                      <Textarea name="features" label="Características" />
                    </div>
                  </section>
                );
              },
            },
            {
              key: "price",
              title: "Preço",
              content: () => {
                return (
                  <section>
                    <div className="row">
                      <InputCurrency name="costPrice" label="Preço de custo" />

                      <Input label="Margem de lucro" name="profitMargin" />

                      <InputCurrency label="* Preço de venda" name="price" />

                      <InputCurrency
                        name="maximumDiscountPercentage"
                        label="Desconto Máximo (%)"
                        prefix=" "
                      />

                      <InputCurrency
                        name="maximumDiscountValue"
                        label="Desconto Máximo (R$)"
                        prefix=" "
                      />
                    </div>

                    <div className="row">
                      <Select
                        label="Tipo de meta"
                        name="metaType"
                        onlyOneValue
                        options={[
                          { label: "Valor", value: "v" },
                          { label: "Quantidade", value: "q" },
                        ]}
                      />

                      <Input label="Comissão" name="commission" />

                      <Input label="Meta de Venda" name="meta" />

                      <Input label="Comissão Meta" name="commissionMeta" />
                    </div>
                  </section>
                );
              },
            },
          ]}
        />
      </section>
    </FormHandler>
  );
}
