// @ts-nocheck

// Core
import React, { useState, useCallback, useEffect, memo } from "react";

// Icons
import { SearchIcon } from "@/OLD/common/icons";

// Hooks
import { usePaymentMethods } from "@/OLD/hooks/usePaymentMethods";

// Services
import { paymentMethodsService } from "@/OLD/services/paymentMethods.service";

// Utils
import { Columns } from "./Colums";

// Components
import { BodyPage, Input as InputBox } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { Table, Select, Modal, notification } from "antd";
import FormChild from "./FormChild";
import Actions from "./Actions";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import AccessDenied from "@/OLD/components/AccessDenied";
const { Option } = Select;

const PaymentMethods = memo(function () {
  const [filters, setFilters] = useState({});
  const [newPaymentMethod, setNewPaymentMethod] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [formatedPaymentMethods, setFormatedPaymentMethods] = useState([]);
  const [data, setData] = useState({
    active: true,
    requiresDocument: false,
    allowChangeExpirationDate: false,
    automaticCancellation: false,
  });

  const listPaymentMethodsPermission = useUserHasPermission("FPG00");
  const canCreatePaymentMethods = useUserHasPermission("FPG01");

  const { paymentMethods } = usePaymentMethods(filters, reload);

  const formatPaymentMethods = () => {
    paymentMethods?.length > 0
      ? setFormatedPaymentMethods(
          paymentMethods.map((method) => {
            return {
              name: method?.description,
              tef:
                method?.tef !== "NAO"
                  ? `${method?.tef} / ${method?.type}`
                  : "Não",
              aTransfer: method?.automatic_cancelation ? "Sim" : "Não",
              account: method?.account,
              active: method?.active ? "Ativo" : "Inativo",
              actions: (
                <Actions
                  method={method}
                  reload={reload}
                  setReload={setReload}
                />
              ),
            };
          })
        )
      : setFormatedPaymentMethods([]);
  };

  useEffect(() => {
    formatPaymentMethods();
  }, [paymentMethods, reload]);

  const submitPaymentMethod = useCallback(() => {
    if (!data.description) {
      return notification.warning({
        message: "Verifique o campo obrigatório: Descrição",
      });
    }

    if (!data?.usage) {
      return notification.warning({
        message: "Campo tipo pagamento obrigatório",
      });
    }

    if (!data.daysFirstInstallment) {
      return notification.warning({
        message: "Verifique o campo obrigatório: Dias da primeira parcela",
      });
    }

    if (!data.daysBetweenInstallments) {
      return notification.warning({
        message: "Verifique o campo obrigatório: Dias entre as parcelas",
      });
    }

    if (!data.minimumInstallmentValue) {
      return notification.warning({
        message: "Verifique o campo obrigatório: Valor mínimo da parcela",
      });
    }

    if (!data.tef) {
      return notification.warning({
        message: "Verifique o campo obrigatório: TEF",
      });
    }

    if (data.tef !== "NAO" && !data.type) {
      return notification.warning({
        message: "Verifique o campo obrigatório: Tipo",
      });
    }

    setLoading(true);
    paymentMethodsService
      .createPaymentMethod(data)
      .then((_res) => {
        notification.success({
          message: "Forma de pagamento adicionada com sucesso!",
        });
        setNewPaymentMethod(false);
        setData({
          active: true,
          requiresDocument: false,
          allowChangeExpirationDate: false,
          automaticCancellation: false,
        });
        setReload(!reload);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao cadastrar a forma de pagamento",
        });
      });
  }, [data]);

  return !listPaymentMethodsPermission ||
    listPaymentMethodsPermission === "loading" ? (
    <AccessDenied loading={listPaymentMethodsPermission} />
  ) : (
    <BodyPage className="uk-padding">
      <h3 className="uk-margin-remove">Formas de pagamento</h3>
      <div className="uk-margin-right uk-flex uk-flex-around uk-flex-middle">
        <InputBox className="uk-margin-top">
          <input
            type="search"
            placeholder="Forma de pagamento"
            onChange={(e) =>
              setFilters({ ...filters, description: e.target.value })
            }
          />
          <SearchIcon />
        </InputBox>
        <div className="uk-width-1-2 uk-margin-small-top uk-margin-small-right">
          <Select
            placeholder="TEF"
            className="uk-width-1-1"
            onChange={(e) => {
              if (e === "all") {
                return setFilters({ ...filters, tef: false });
              }
              setFilters({ ...filters, tef: e });
            }}
          >
            <Option value="all">Todos</Option>
            <Option value="TEF">TEF</Option>
            <Option value="POS">POS</Option>
            <Option value="NAO">NÃO</Option>
          </Select>
        </div>
        <div className="uk-width-1-2 uk-margin-small-right uk-margin-small-top">
          <Select
            placeholder="Tipo operação"
            className="uk-width-1-1"
            onChange={(e) => {
              if (e === "all") {
                return setFilters({ ...filters, type: false });
              }
              setFilters({ ...filters, type: e });
            }}
          >
            <Option value="all">Todos</Option>
            <Option value="CREDITO">Credito</Option>
            <Option value="DEBITO">Debito</Option>
          </Select>
        </div>
        <div className="uk-width-1-2 uk-margin-small-right uk-margin-small-top">
          <Select
            placeholder="Baixa automática"
            className="uk-width-1-1"
            onChange={(e) => {
              if (e === "all") {
                const newObj = { ...filters };
                delete newObj?.cancellation;
                return setFilters(newObj);
              }
              setFilters({ ...filters, cancellation: e });
            }}
          >
            <Option value="all">Todos</Option>
            <Option value="true">Sim</Option>
            <Option value="false">Não</Option>
          </Select>
        </div>
        <div className="uk-width-1-2 uk-margin-small-right uk-margin-small-top">
          <Select
            placeholder="Tipo de conta"
            className="uk-width-1-1"
            onChange={(e) => {
              if (e === "all") {
                return setFilters({ ...filters, account: false });
              }
              return setFilters({ ...filters, account: e });
            }}
          >
            <Option value="all">Todos</Option>
            <Option value="CONTA_CORRENTE">Conta corrente</Option>
            <Option value="CONTA_POUPANCA">Conta pupança</Option>
            <Option value="CONTA_INVESTIMENTO">Conta investimento</Option>
            <Option value="CONTA_CAIXA_UNIDADE_NEGOCIO">
              Conta caixa/Cofre unidade negócio
            </Option>
          </Select>
        </div>
        <div className="uk-width-1-2 uk-margin-small-right uk-margin-small-top">
          <Select
            placeholder="Status"
            className="uk-width-1-1"
            onChange={(e) => {
              if (e === "all") {
                const newObj = { ...filters };
                delete newObj?.active;
                return setFilters(newObj);
              }
              return setFilters({ ...filters, active: e });
            }}
          >
            <Option value="all">Todos</Option>
            <Option value="true">Ativo</Option>
            <Option value="false">Inativo</Option>
          </Select>
        </div>
        <div className="uk-margin-small-top">
          <CustomButton
            onClick={() => setNewPaymentMethod(true)}
            disabled={!canCreatePaymentMethods}
          >
            Cadastrar
          </CustomButton>
        </div>
      </div>
      <hr />
      <div className="uk-margin-top">
        <Table columns={Columns} dataSource={formatedPaymentMethods} />
      </div>
      <Modal
        title="Cadastro de forma de pagamento"
        visible={newPaymentMethod}
        onCancel={() => setNewPaymentMethod(false)}
        footer={null}
        width={800}
      >
        <FormChild
          data={data}
          setData={setData}
          submit={submitPaymentMethod}
          setVisible={setNewPaymentMethod}
          reload={reload}
          setReload={setReload}
        />
      </Modal>
    </BodyPage>
  );
});

export default PaymentMethods;
