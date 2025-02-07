// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// Hooks
import { useCheckingAccounts } from "@/OLD/hooks/useCheckingAccounts";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

// Services
import { checkingAccountService } from "@/OLD/services/checkingAccount.service";

// Utils
import { Columns } from "./Columns";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

// Components
import { Modal, Table, notification, Select } from "antd";
import AccessDenied from "@/OLD/components/AccessDenied";
import { Container, Input as InputBox } from "./styles";
import { Button, PageWrapper } from "infinity-forge";
import FormChild from "./FormChild";
import Actions from "./Actions";
const { Option } = Select;

const CheckingAccounts = memo(function CheckingAccounts() {
  const [filters, setFilters] = useState({});
  const [reload, setReload] = useState(false);
  const [newAccountVisible, setNewAccountVisible] = useState(false);
  const [data, setData] = useState({
    limit: currencyFormatter(0),
    balance: currencyFormatter(0),
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [formatedAccounts, setFormatedAccounts] = useState([]);
  const { checkingAccounts } = useCheckingAccounts(reload, filters);
  const router = useRouter();

  const canCreateAccountBank = useUserHasPermission("CCO01");
  const listAccountsBankPermission = useUserHasPermission("CCO00");

  const formatCheckingAccounts = () => {
    setFormatedAccounts(
      checkingAccounts.length > 0
        ? checkingAccounts.map((account) => {
            return {
              name: (
                  <span
                    className="uk-link"
                    onClick={() =>
                      router.push(`/dashboard/contas-bancarias/${account?.id}`)
                    }
                  >
                    {account?.description}
                  </span>
              ),
              accountCode: account?.bank_code,
              bank: account?.bank_name,
              agency: account?.agency,
              type: account?.type.toLowerCase().replace("_", " "),
              manager: account?.manager_name,
              unit: account?.unit?.identification,
              actions: (
                <Actions
                  account={account}
                  reload={reload}
                  setReload={setReload}
                />
              ),
            };
          })
        : []
    );
  };

  useEffect(() => {
    formatCheckingAccounts();
  }, [reload, checkingAccounts]);

  const openCheckingAccount = useCallback(() => {
    setLoading(true);
    const newObj = { ...data };
    delete newObj?.balance,
      checkingAccountService
        .openCheckingAccount({
          ...newObj,
          limit: convertIntlCurrency(newObj?.limit),
        })
        .then((_res) =>
          notification.success({
            message: "Conta cadastrada com sucesso!",
          })
        )
        .catch((err) => {
          setLoading(false);
          if (err?.response?.data?.message) {
            const messageArr = err?.response?.data?.message.split(":");
            return notification.error({ message: messageArr[1] });
          }
          return notification.error({
            message: "Houve um erro ao realizar o cadastro da conta...",
          });
        })
        .finally(() => {
          setReload(!reload);
          setData({
            limit: currencyFormatter(0),
            balance: currencyFormatter(0),
            active: true,
          });
          setNewAccountVisible(false);
        });
  }, [data]);

  return !listAccountsBankPermission ||
    listAccountsBankPermission === "loading" ? (
    <AccessDenied loading={listAccountsBankPermission} />
  ) : (
    <PageWrapper title="Contas bancárias">
      <Container>
        <div className="uk-margin-right uk-flex uk-flex-around">
          <InputBox>
            <input
              type="search"
              placeholder="Nome da conta"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
   
          </InputBox>
          <InputBox>
            <input
              type="search"
              placeholder="Banco"
              onChange={(e) => setFilters({ ...filters, bank: e.target.value })}
            />

          </InputBox>
        
          <div className="uk-width-1-3 uk-margin-small-top uk-margin-small-right">
            <Select
              placeholder="tipo de conta"
              className="uk-width-1-1"
              onChange={(e) => {
                if (e === "all") {
                  return setFilters(delete filters.type);
                }
                setFilters({ ...filters, type: e });
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
          <div className="uk-margin-small-top">
            <Button
              onClick={() => setNewAccountVisible(true)}
              disabled={!canCreateAccountBank}
              text="Cadastrar"
            />
          </div>
        </div>
        <Modal
          visible={newAccountVisible}
          onCancel={() => setNewAccountVisible(false)}
          title="Cadastro de nova conta bancária"
          width={800}
          footer={null}
        >
          <FormChild
            data={data}
            setData={setData}
            setVisible={setNewAccountVisible}
            submit={openCheckingAccount}
          />
        </Modal>
        <hr />
        <Table
          dataSource={formatedAccounts}
          className="uk-margin-large-top"
          columns={Columns}
        />
      </Container>
    </PageWrapper>
  );
});

export default CheckingAccounts;
