// @ts-nocheck
// Core
import React, { useEffect, useState, memo, useCallback } from "react";

// Icons
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Services
import { checkingAccountService } from "@/OLD/services/checkingAccount.service";

// Utils
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";

// Components
import { Container } from "./styles";
import { Popconfirm, Modal } from "antd";
import FormChild from "../FormChild";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useToast } from "infinity-forge";

const Actions = memo(function Actions({ account, reload, setReload }) {
  const [loading, setLoading] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [data, setData] = useState({});

  const canEditAccountBank = useUserHasPermission("CCO02");
  const canDeleteAccountBank = useUserHasPermission("CCO03");

  const { createToast } = useToast();

  useEffect(() => {
    updateVisible &&
      setData({
        description: account?.description,
        type: account?.type,
        accountNumber: account?.account_number,
        bankCode: account?.bank_code,
        bankName: account?.bank_name,
        agency: account?.agency,
        active: account?.active ? account?.active : false,
        managerName: account?.manager_name,
        managerPhone: account?.manager_phone,
        agencyPhone: account?.agency_phone,
        managerEmail: account?.manager_email,
        limit: currencyFormatter(account?.limit),
        balance: currencyFormatter(account?.balance),
        businessUnitId: account?.unit?.id,
      });
  }, [updateVisible, reload, account]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    const newObj = { ...data };
    delete data?.balance;
    checkingAccountService
      .updateCheckingAccount(account?.id, {
        ...newObj,
        limit: convertIntlCurrency(newObj?.limit),
        businessUnitId: newObj?.businessUnitId || null,
      })
      .then((_res) =>
        createToast({
          message: "Conta atualizada com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");

          createToast({
            message: messageArr[1],
            status: "error",
          });

          return;
        }

        createToast({
          message: "Houve um erro ao atualizar os dados da conta!",
          status: "error",
        });

        return;
      })
      .finally(() => {
        setReload(!reload);
        setData({
          limit: currencyFormatter(0),
          balance: currencyFormatter(0),
          active: true,
        });
        setUpdateVisible(false);
      });
  }, [data, account?.id]);

  const removeCheckingAccount = useCallback(() => {
    setLoading(true);
    checkingAccountService
      .removeCheckingAccount(account?.id)
      .then((_res) =>
        createToast({
          message: "Conta removida com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          createToast({
            message: messageArr[1],
            status: "error",
          });

          return;
        }

        createToast({
          message: "Houve um erro ao remover a conta",
          status: "error",
        });

        return;
      })
      .finally(() => {
        setReload(!reload);
      });
  }, [account?.id]);

  return (
    <Container className="uk-flex uk-flex-around">
      {canEditAccountBank && (
        <FiEdit2 className="icon" onClick={() => setUpdateVisible(true)} />
      )}
      <Popconfirm
        placement="topLeft"
        title="Deseja remover essa conta bancária?"
        onConfirm={removeCheckingAccount}
        okText="Remover"
        cancelText="Cancelar"
      >
        {canDeleteAccountBank && (
          <FiTrash2 className="icon" style={{ color: 'red' }} />
        )}
      </Popconfirm>
      <Modal
        title="Atualizar dados da conta"
        footer={null}
        width={800}
        onCancel={() => setUpdateVisible(false)}
        visible={updateVisible}
      >
        <FormChild
          data={data}
          setData={setData}
          setVisible={setUpdateVisible}
          submit={submitUpdate}
        />
      </Modal>
    </Container>
  );
});

export default Actions;
