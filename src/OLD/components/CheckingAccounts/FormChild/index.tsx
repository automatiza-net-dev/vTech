// @ts-nocheck
// Core
import React, { memo, useEffect, useState } from "react";

// Hooks
import { useBanks } from "@/OLD/hooks/useBanks";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";

// Components
import { Container } from "./styles";
import { Input, Select, Button, Switch, AutoComplete } from "antd";
const { Option } = Select;

// Utils
import masks from "@/OLD/utils/masks";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";

const FormChild = memo(function FormChild({
  data,
  setData,
  setVisible,
  submit
}) {
  const [formatedBanks, setFormatedBanks] = useState([]);

  const { banks } = useBanks(false);
  const { businessUnits } = useBusinessUnitsByUser();

  const formatBanks = () => {
    setFormatedBanks(
      banks.map((bank) => {
        return (
          bank.active && {
            value: `${bank?.code} - ${bank?.name}`,
            name: bank?.name,
            code: bank?.code
          }
        );
      })
    );
  };

  useEffect(() => {
    banks.length > 0 && formatBanks();
  }, [banks]);

  return (
    <Container>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="uk-flex">
          <div className="uk-margin-right">
            <label>Nome/Descrição conta corrente</label>
            <Input
              required
              value={data?.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              options={formatedBanks}
            />
          </div>
          <div className="uk-width-1-2">
            <label>Tipo de conta</label>
            <Select
              required
              className="uk-width-1-1"
              onChange={(e) => setData({ ...data, type: e })}
              value={data?.type}
            >
              <Option value="CONTA_CORRENTE">Conta corrente</Option>
              <Option value="CONTA_POUPANCA">Conta pupança</Option>
              <Option value="CONTA_INVESTIMENTO">Conta investimento</Option>
              <Option value="CONTA_CAIXA_UNIDADE_NEGOCIO">
                Conta caixa/Cofre unidade negócio
              </Option>
            </Select>
          </div>
        </div>
        <div className="uk-margin-small-top">
          <label>Unidade</label>
          <Select
            allowClear
            className="uk-width-1-1"
            value={data?.businessUnitId}
            onChange={(val) => setData({ ...data, businessUnitId: val })}
          >
            {businessUnits?.map((unit) => (
              <Option key={unit?.id} value={unit?.id}>
                {unit?.identification}
              </Option>
            ))}
          </Select>
        </div>
        <div className="uk-flex uk-margin-top">
          <div className="uk-margin-right">
            <label>Numero Conta</label>
            <Input
              value={data?.accountNumber}
              onChange={(e) =>
                setData({ ...data, accountNumber: e.target.value })
              }
            />
          </div>
          <div className="uk-margin-right uk-width-1-1">
            <label>Banco</label>
            <AutoComplete
              options={formatedBanks}
              value={
                data?.bankCode
                  ? `${data?.bankCode} - ${data?.bankName}`
                  : data?.bankName
              }
              className="uk-width-1-1"
              onChange={(e) =>
                setData({ ...data, bankCode: false, bankName: e })
              }
              onSelect={(_, option) =>
                setData({
                  ...data,
                  bankCode: option?.code,
                  bankName: option?.name
                })
              }
              filterOption={(inputValue, option) => {
                if (
                  option.name
                    .toUpperCase()
                    .includes(inputValue.toUpperCase()) ||
                  option.code.includes(inputValue)
                ) {
                  return option;
                }
              }}
            />
          </div>
          <div className="uk-margin-right">
            <label>Código Agência</label>
            <Input
              value={data?.agency}
              onChange={(e) => setData({ ...data, agency: e.target.value })}
            />
          </div>
        </div>
        <div className="uk-flex uk-margin-top">
          <div className="uk-margin-right">
            <label> Nome gerente </label>
            <Input
              value={data?.managerName}
              onChange={(e) =>
                setData({ ...data, managerName: e.target.value })
              }
            />
          </div>
          <div className="uk-margin-right">
            <label> Fone gerente </label>
            <Input
              value={data?.managerPhone}
              onChange={(e) =>
                setData({ ...data, managerPhone: masks.phone(e.target.value) })
              }
            />
          </div>
          <div className="uk-margin-right">
            <label> Fone Agencia </label>
            <Input
              value={data?.agencyPhone}
              onChange={(e) =>
                setData({ ...data, agencyPhone: masks.phone(e.target.value) })
              }
            />
          </div>
          <div className="uk-margin-right">
            <label>E-mail Gerente</label>
            <Input
              type="email"
              value={data?.managerEmail}
              onChange={(e) =>
                setData({ ...data, managerEmail: e.target.value })
              }
            />
          </div>
        </div>
        <div className="uk-flex uk-flex-around uk-margin-top">
          <div className="uk-width-1-3">
            <label> Limite R$ </label>
            <Input
              value={data?.limit}
              onChange={(e) =>
                setData({
                  ...data,
                  limit: currencyFormatter(convertIntlCurrency(e.target.value))
                })
              }
            />
          </div>
          <div className="uk-width-1-3">
            <label> Saldo R$ </label>
            <Input disabled value={data?.balance} />
          </div>
          <div className="uk-width-1-6">
            <label>Ativo</label>
            <br />
            <Switch
              checked={data?.active}
              onChange={(e) => setData({ ...data, active: e })}
            />
          </div>
        </div>
        <hr />
        <footer className="uk-margin-top uk-flex uk-flex-right">
          <Button htmlType="submit" type="primary" className="uk-margin-right">
            Salvar
          </Button>
          <Button htmlType="button" onClick={() => setVisible(false)}>
            Cancelar
          </Button>
        </footer>
      </form>
    </Container>
  );
});

export default FormChild;
