import * as React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";

import { billService } from "@/OLD/services/bills.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { CgDetailsMore } from "react-icons/cg";
import { FiLock, FiUnlock } from "react-icons/fi";
import { DeleteTwoTone } from "@ant-design/icons";

import {  Modal } from "antd";
import AddBillItem from "./AddBillItem";
import ConvertBillToTreatment from "./ConvertBillToTreatment";
import Details from "./Details";
import AddBillPayment from "@/OLD/components/Bill/Actions/AddBillPayment";
import { PageWrapper, Popconfirm, useToast } from "infinity-forge";

import moment from "moment";
import { MdMonetizationOn } from "react-icons/md";
import { LaunchRelatedSale } from "./launch-related-sale";
import { CancelAction } from "./cancel";

const Container = styled.div`
  display: flex;
  gap: 0.75rem;

  .icon {
    cursor: pointer;
  }
`;

function BillActions({ bill, client, setReload = false, cashiers }) {
  const [filters, setFilters] = React.useState({});
  const [selectedId, setSelectedId] = React.useState(false);
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [paymentsVisible, setPaymentsVisible] = React.useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const addPaymentPermission = useUserHasPermission("VEN04");
  const finishBillPermission = useUserHasPermission("VEN06");
  const convertTreatmentPermission = useUserHasPermission("VEN07");
  const removeBillPermission = useUserHasPermission("VEN12");
  const reopenBillPermission = useUserHasPermission("VEN15");

  const { createToast } = useToast();

  const closeBill = React.useCallback(() => {
    billService
      .closeBillPayment(bill?.id)
      .then((_res) => {
        createToast({
          status: "success",
          message: "Venda finalizada com sucesso!",
        });
      })
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message ||
          "Houve um erro ao finalizar a venda, verifique se ainda há valores pendentes";

        createToast({ status: "error", message: errorMessage });
      })
      .finally(() => {
        queryClient.invalidateQueries(["bills"]);
        setReload && setReload((prv) => !prv);
      });
  }, [bill?.id, queryClient, setReload]);

  const reopenBillPayment = React.useCallback(() => {
    billService
      .reopenBillPayment(bill?.id)
      .then((_res) =>
        createToast({
          status: "success",
          message: "Venda reaberta com sucesso!",
        })
      )
      .catch((_err) =>
        createToast({
          status: "error",
          message: "Houve um problema ao finalizar a venda",
        })
      )
      .finally(() => {
        queryClient.invalidateQueries(["bills"]);
        setReload && setReload((prv) => !prv);
      });
  }, [bill?.id]);

  const removeBill = React.useCallback(() => {
    billService
      .removeBill(bill?.id)
      .then((_res) => {
        queryClient.invalidateQueries(["bills"]);
        setReload && setReload((prv) => !prv);
        return createToast({
          status: "success",
          message: "Nota de saída removida com sucesso!",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          createToast({
            status: "error",
            message: err.response.data.message.replace("E_ERR:", ""),
          });
          return;
        }

        return createToast({
          status: "error",
          message: "Houve um erro ao remover a nota de saída...",
        });
      });
  }, [bill?.id]);

  React.useEffect(() => {
    setFilters({
      from: moment(new Date()).startOf("day"),
      to: moment(new Date()).endOf("day"),
      status: "ABERTO",
    });
  }, []);

  return (
    <Container className="uk-flex uk-flex-around uk-flex-middle">
      {(bill?.status === "ABERTA" ||
        bill?.status === "Venda em Aberto" ||
        bill?.status === "Nao Aprovada") && (
        <>
          <AddBillItem bill={bill} />

          {addPaymentPermission && (
            <MdMonetizationOn
              className="icon"
              size={20}
              onClick={() => {
                setSelectedId(bill?.id);
                setPaymentsVisible(true);
              }}
            />
          )}
        </>
      )}
      {(bill?.status === "ABERTA" || bill?.status === "Venda em Aberto") &&
        finishBillPermission && (
          <FiLock onClick={() => closeBill()} size={20} className="icon" />
        )}

      {(bill?.status === "BAIXADA" || bill?.status === "Venda Finalizada") && (
        <>
          {reopenBillPermission && (
            <FiUnlock
              onClick={() => reopenBillPayment()}
              size={20}
              className="icon"
            />
          )}
        </>
      )}

      <CancelAction bill={bill} />

      {convertTreatmentPermission && (
        <ConvertBillToTreatment bill={bill} setReload={setReload} />
      )}

      <LaunchRelatedSale billId={bill.id} internalCode={bill?.internalCode} />

      <CgDetailsMore
        size={25}
        className="icon"
        onClick={() => {
          setSelectedId(bill?.id);
          setDetailsVisible(true);
        }}
      />

      {removeBillPermission && (
        <Popconfirm
          title={`Confirma exclusao da venda ${bill?.tag}?`}
          onConfirm={() => removeBill()}
          position="leftTop"
        >
          <DeleteTwoTone twoToneColor={"red"} className="icon" />
        </Popconfirm>
      )}

      {detailsVisible && (
        <Modal
          visible={detailsVisible}
          footer={null}
          width={1400}
          onCancel={() => {
            setSelectedId(false);
            setDetailsVisible(false);
          }}
        >
          <PageWrapper title="Detalhes da Venda">
            <Details billId={selectedId} setVisible={setDetailsVisible} />
          </PageWrapper>
        </Modal>
      )}

      {paymentsVisible && (
        <Modal
          width={1500}
          visible={paymentsVisible}
          footer={null}
          onCancel={() => setPaymentsVisible(false)}
        >
          <AddBillPayment billId={bill?.id} setVisible={setPaymentsVisible} />
        </Modal>
      )}
    </Container>
  );
}

export default BillActions;
