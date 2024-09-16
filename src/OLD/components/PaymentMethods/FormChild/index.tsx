// @ts-nocheck

// Core
import React, { memo, useState } from "react";

// Hooks
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";

// Components
import CardFlags from "./CreateCardFlags";
import { Container } from "./styles";
import {
  Switch,
  Input,
  Select,
  Button,
  Modal,
  notification,
  Table
} from "antd";
const { Option } = Select;
import FlagsTable from "./FlagsTable";

function FormChild({
  submit,
  data,
  setData,
  setVisible,
  reload,
  setReload,
  methodId
}) {
  const [flagsVisible, setFlagsVisible] = useState(false);
  const { checkingAccounts } = useCheckingAccounts();

  return (
    <Container>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="uk-flex">
          <div className="uk-margin-right uk-width-2-3">
            <label>Nome/Descrição*</label>
            <Input
              value={data?.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
          <div>
            <label>Tipo Pagamento*</label>
            <Select
              required
              className="uk-width-1-1"
              value={data?.usage}
              onChange={(val) => setData({ ...data, usage: val })}
            >
              <Option value="PAGAR">Pagar</Option>
              <Option value="RECEBER">Receber</Option>
              <Option value="AMBOS">Ambos</Option>
            </Select>
          </div>
          <div className="uk-flex uk-flex-column uk-flex-middle uk-width-1-3">
            <label>Ativo</label>
            <Switch defaultChecked={data?.active} />
          </div>
        </div>
        <div className="uk-flex uk-margin-top">
          <div className="uk-margin-small-right">
            <label>Taxa Desconto (%)</label>
            <Input
              onChange={(e) => setData({ ...data, fee: e.target.value })}
              value={data?.fee}
              placeholder="Verificar"
            />
          </div>
          <div className="uk-margin-small-right">
            <label>Intervalo dias 1º Parcela*</label>
            <Input
              type="number"
              value={data?.daysFirstInstallment}
              onChange={(e) =>
                setData({ ...data, daysFirstInstallment: e.target.value })
              }
            />
          </div>
          <div>
            <label>Intervalo dias demais parcelas*</label>
            <Input
              type="number"
              value={data?.daysBetweenInstallments}
              onChange={(e) =>
                setData({ ...data, daysBetweenInstallments: e.target.value })
              }
            />
          </div>
        </div>
        <div className="uk-flex uk-margin-top">
          <div className="uk-margin-small-right">
            <label>Nº Máximo Parcelas</label>
            <Input
              value={data?.maxInstallments}
              onChange={(e) =>
                setData({ ...data, maxInstallments: e.target.value })
              }
            />
          </div>
          <div className="uk-margin-small-right">
            <label>Nº Máximo parcelas sem senha </label>
            <Input
              value={data?.installmentsWithoutPassword}
              onChange={(e) =>
                setData({
                  ...data,
                  installmentsWithoutPassword: e.target.value
                })
              }
            />
          </div>
          <div>
            <label>Valor Mínimo parcela *</label>
            <Input
              value={data?.minimumInstallmentValue}
              onChange={(e) =>
                setData({ ...data, minimumInstallmentValue: e.target.value })
              }
            />
          </div>
        </div>
        <div className="uk-flex uk-margin-top uk-text-center">
          <div className="uk-margin-small-right">
            <label>Exige documento</label>
            <Switch
              defaultChecked={data?.requiresDocument}
              onChange={(e) => setData({ ...data, requiresDocument: e })}
            />
          </div>
          <div className="uk-margin-small-right">
            <label>Altera data Vencimento</label>
            <Switch
              defaultChecked={data?.allowChangeExpirationDate}
              onChange={(e) =>
                setData({ ...data, allowChangeExpirationDate: e })
              }
            />
          </div>
          <div className="uk-margin-small-right">
            <label>Baixa Automatica</label>
            <Switch
              defaultChecked={data?.automaticCancellation}
              onChange={(e) => setData({ ...data, automaticCancellation: e })}
            />
          </div>
          <div>
            <label>Conta corrente padrão baixa</label>
            <Select
              className="uk-width-1-1"
              value={data?.checkingAccountId}
              onChange={(e) => setData({ ...data, checkingAccountId: e })}
            >
              {checkingAccounts.length > 0
                ? checkingAccounts.map((account) => (
                    <Option value={account?.id}>{account?.description}</Option>
                  ))
                : "Nenhuma conta registrada"}
            </Select>
          </div>
        </div>
        <div className="uk-flex uk-margin-top">
          <div className="uk-width-1-4 uk-margin-small-right">
            <label>Tef*</label>
            <Select
              className="uk-width-1-1"
              onChange={(e) => setData({ ...data, tef: e })}
              value={data?.tef}
            >
              <Option value="TEF">TEF</Option>
              <Option value="POS">POS</Option>
              <Option value="NAO">NÃO</Option>
            </Select>
          </div>
          {/*
          <div className="uk-margin-small-right">
            <label>Dias Repasse Adm. Cartão</label>
            <Input
              value={data?.daysUntilTransfer}
              type="number"
              onChange={(e) =>
                setData({ ...data, daysUntilTransfer: e.target.value })
              }
            />
          </div>
          */}
          <div className="uk-width-1-4">
            <label>Tipo da operação*</label>
            <Select
              className="uk-width-1-1"
              value={data?.type}
              onChange={(e) => setData({ ...data, type: e })}
            >
              <Option value="CREDITO">Crédito</Option>
              <Option value="DEBITO">Débito</Option>
            </Select>
          </div>
        </div>
        <hr />
        <FlagsTable
          flags={data?.flags?.sort((a, b) => {
            if (
              a?.acquirer?.description?.toLowerCase() <
              b.acquirer?.description?.toLowerCase()
            ) {
              return -1;
            }

            if (
              a.acquirer?.description?.toLowerCase() >
              b.acquirer?.description?.toLowerCase()
            ) {
              return 1;
            }

            return 0;
          })}
          reload={reload}
          setReload={setReload}
        />
        <hr />
        <footer className="uk-flex uk-flex-right">
          <Button type="primary" htmlType="submit" className="uk-margin-right">
            Salvar
          </Button>
          <Button htmlType="button" onClick={() => setVisible(false)}>
            Cancelar
          </Button>
        </footer>
      </form>
      {data?.update && (
        <Button
          onClick={() => {
            if (!data?.type) {
              return notification.warning({
                message: "Informa o tipo de operação"
              });
            }
            setFlagsVisible(true);
          }}
        >
          Selecionar bandeiras
        </Button>
      )}
      <Modal
        title="Selecionar bandeiras"
        visible={flagsVisible}
        onCancel={() => setFlagsVisible(false)}
        footer={null}
        width={700}
      >
        <CardFlags
          type={data?.type}
          reload={reload}
          setReload={setReload}
          method={data}
          setVisible={setFlagsVisible}
          methodId={methodId}
        />
      </Modal>
    </Container>
  );
};

export default FormChild;
