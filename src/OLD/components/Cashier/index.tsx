// @ts-nocheck
// Core
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// Services
import { dailyCasherService } from "@/OLD/services/dailyCasher.service";

// Components
import { Container } from "./styles";
import { Modal, notification } from "antd";
import CashierHeader from "./CashierHeader";
import CashierPanel from "./CashierPanel";
import ReceiptForm from "./ReceiptAndExpensesForm";
import { Button } from "infinity-forge";

// Hooks
import { useDailyCasher } from "@/OLD/hooks/useDailyCashiers";

// Utils
import moment from "moment";
import Masks from "@/OLD/utils/masks";

const Cashier = memo(function Cashier() {
  const [type, setType] = useState("");
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [dailyCasher, setDailyCasher] = useState([]);
  const router = useRouter();

  const id = router?.query?.innerpage;

  const [filters, setFilters] = useState({ id });

  const { cashiers } = useDailyCasher(reload, filters);

  useEffect(() => {
    setDailyCasher(cashiers);
  }, [cashiers]);

  useEffect(() => {
    setFilters({ id });
  }, [id]);

  const createReceipt = useCallback(() => {
    setLoading(true);
    dailyCasherService
      .receiptDailyCasher(dailyCasher?.id, {
        entryDate: moment(new Date()).toISOString(),
        description: data?.description,
        value: Masks.noMoney(data?.value),
        paymentMethodId: data?.paymentMethodId,
        accountPlanId: data?.accountPlanId,
        fiscalNote: data?.fiscalNote,
      })
      .then((_res) => {
        setLoading(false);
        setData({});
        setReload(!reload);
        setVisible(false);
        return notification.success({
          message: "Recebimento registrado com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao registrar o recebimento...",
        });
      });
  }, [data, dailyCasher?.id]);

  const createExpense = useCallback(() => {
    setLoading(true);
    dailyCasherService
      .expenseDailyCasher(dailyCasher?.id, {
        entryDate: moment(new Date()).toISOString(),
        description: data?.description,
        value: Masks?.noMoney(data?.value),
        paymentMethodId: data?.paymentMethodId,
        accountPlanId: data?.accountPlanId,
        fiscalNote: data?.fiscalNote,
      })
      .then((_res) => {
        setLoading(false);
        setData({});
        setReload(!reload);
        setVisible(false);
        return notification.success({
          message: "Despesa registrada com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.data?.message) {
          const messageArr = err?.response?.data?.message.split(":");
          return notification.error({ message: messageArr[1] });
        }
        return notification.error({
          message: "Houve um erro ao registrar a despesa...",
        });
      });
  }, [data, dailyCasher?.id]);

  return (
    <div className="uk-margin-top">
      <h3 className="uk-margin-remove">Lançamento de caixa diário</h3>
      <Container className="uk-padding uk-margin-top">
        <CashierHeader casherData={dailyCasher} />
        <hr />
        <CashierPanel
          setType={setType}
          setVisible={setVisible}
          entries={dailyCasher?.entries}
        />
      </Container>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          type === "Recebimento" && createReceipt();
          type === "Despesa" && createExpense();
        }}
        title={`Lançamento de ${type}`}
      >
        <ReceiptForm data={data} setData={setData} type={type} />
      </Modal>
      <br />
      <Button onClick={() => router.back()} text="Fechar" />
    </div>
  );
});

export default Cashier;
