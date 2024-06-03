// @ts-nocheck
// Core
import React, { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

// Hooks
import { useSingleCheckingAccount } from "@/OLD/hooks/useSingleCheckingAccount";

// Services
import { checkingAccountService } from "@/OLD/services/checkingAccount.service";

// Components
import { Container } from "./styles";
import FormChild from "../FormChild";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";
import { Descriptions, Modal, notification } from "antd";
const { Item } = Descriptions;

const Single = memo(function Single() {
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const router = useRouter();
  const { checkingAccount } = useSingleCheckingAccount(
    router.query.subpage,
    reload
  );

  useEffect(() => {
    setData({
      description: checkingAccount?.description,
      type: checkingAccount?.type,
      accountNumber: checkingAccount?.account_number,
      bankCode: checkingAccount?.bank_code,
      bankName: checkingAccount?.bank_name,
      agency: checkingAccount?.agency,
      active: checkingAccount?.active ? checkingAccount?.active : false,
      managerName: checkingAccount?.manager_name,
      managerPhone: checkingAccount?.manager_phone,
      agencyPhone: checkingAccount?.agency_phone,
      managerEmail: checkingAccount?.manager_email,
      limit: checkingAccount?.limit,
      businessUnitId: checkingAccount?.unit?.id,
    });
  }, [updateVisible, reload, checkingAccount]);

  const submitUpdate = useCallback(() => {
    setLoading(true);
    checkingAccountService
      .updateCheckingAccount(checkingAccount?.id, data)
      .then((_res) =>
        notification.success({
          message: "Conta atualizada com sucesso!",
        })
      )
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao atualizar os dados da conta!",
        });
      })
      .finally(() => {
        setReload(!reload);
        setData({});
        setUpdateVisible(false);
      });
  }, [data, checkingAccount?.id]);

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Detalhes da conta bancária</h3>
      <div className="uk-flex uk-flex-right">
        <CustomButton
          classCallback="uk-margin-right"
          onClick={() => router.back()}
        >
          Voltar
        </CustomButton>
        <CustomButton onClick={() => setUpdateVisible(true)}>
          Editar
        </CustomButton>
      </div>
      <section className="body-page uk-margin-top uk-padding">
        <Descriptions title="Detalhes">
          <Item label="Nome da conta">{data?.description}</Item>
          <Item label="Agência">{data?.agency}</Item>
          <Item label="Código banco">{data?.bankCode}</Item>
          <Item label="Telefone agência">{data?.agencyPhone}</Item>
          <Item label="Nome do banco">{data?.bankName}</Item>
          <Item label="Limite">{data?.limit}</Item>
          <Item label="Email gerente">{data?.managerEmail}</Item>
          <Item label="Nome do gerente">{data?.managerName}</Item>
          <Item label="Telefone gerente">{data?.managerPhone}</Item>
          <Item label="Tipo">
            {data?.type?.toLowerCase().replace("_", " ")}
          </Item>
          <Item label="Unidade">{checkingAccount?.unit?.identification}</Item>
        </Descriptions>
      </section>
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

export default Single;
