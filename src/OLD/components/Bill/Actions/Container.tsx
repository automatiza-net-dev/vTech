import * as React from "react";
import styled from "styled-components";

import { billService } from "@/OLD/services/bills.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { CgDetailsMore } from "react-icons/cg";
import { FiLock, FiUnlock, FiTrash2 } from "react-icons/fi";

import AddBillItem from "./AddBillItem";
import ConvertBillToTreatment from "./ConvertBillToTreatment";
import Details from "./Details";

import {
  Modal,
  PageWrapper,
  Popconfirm,
  Tooltip,
  useToast,
} from "infinity-forge";

import { useQueryClient } from "infinity-forge";

import { LaunchRelatedSale } from "./launch-related-sale";
import { CancelAction } from "./cancel";
import { AddBillPaymentModal } from "./add-bill-payment-modal";
import { MdMonetizationOn } from "react-icons/md";

const Container = styled.div`
  display: flex;
  gap: 0.75rem;

  .icon {
    cursor: pointer;
  }
`;

function BillActions({
  bill,
  setReload,
  setOpenCredits,
  setSelectedTutor,
}: any) {
  const [selectedId, setSelectedId] = React.useState(false);
  const [detailsVisible, setDetailsVisible] = React.useState(false);

  const queryClient = useQueryClient();

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

        setReload && setReload((prv) => !prv);
      })
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message ||
          "Houve um erro ao finalizar a venda, verifique se ainda há valores pendentes";

        createToast({ status: "error", message: errorMessage });
      })
      .finally(() => {
        queryClient.invalidateQueries(["bills"]);
      });
  }, [bill?.id, queryClient, setReload]);

  const reopenBillPayment = React.useCallback(() => {
    billService
      .reopenBillPayment(bill?.id)
      .then((_res) =>
        createToast({
          status: "success",
          message: "Venda reaberta com sucesso!",
        }),
      )
      .catch((_err) =>
        createToast({
          status: "error",
          message: "Houve um problema ao finalizar a venda",
        }),
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

  return (
    <Container className="uk-flex uk-flex-around uk-flex-middle">
      {(bill?.status === "ABERTA" ||
        bill?.status === "Venda em Aberto" ||
        bill?.status === "Nao Aprovada") && (
        <>
          <AddBillItem bill={bill} />

          <Tooltip
            idTooltip="test"
            enableHover
            position="top-right"
            content={"Lançar Pagamentos"}
            trigger={
              <MdMonetizationOn
                className="icon"
                size={20}
                onClick={() => {
                  setSelectedTutor?.({
                    patient: bill.patient.id,
                    tutor: bill.client.id,
                  });
                  setOpenCredits(true);
                }}
              />
            }
          />
        </>
      )}

      {(bill?.status === "ABERTA" || bill?.status === "Venda em Aberto") &&
        finishBillPermission && (
          <Tooltip
            idTooltip="test"
            enableHover
            position="top-right"
            content={"Finalizar Venda"}
            trigger={
              <FiLock onClick={() => closeBill()} size={20} className="icon" />
            }
          />
        )}

      {(bill?.status === "BAIXADA" || bill?.status === "Venda Finalizada") && (
        <>
          {reopenBillPermission && (
            <Tooltip
              idTooltip="test"
              enableHover
              position="top-right"
              content={"Reabrir Venda"}
              trigger={
                <FiUnlock
                  onClick={() => reopenBillPayment()}
                  size={20}
                  className="icon"
                />
              }
            />
          )}
        </>
      )}

      <CancelAction bill={bill} />

      {convertTreatmentPermission && (
        <ConvertBillToTreatment bill={bill} setReload={setReload} />
      )}

      <LaunchRelatedSale {...bill} />

      <Tooltip
        idTooltip="test"
        enableHover
        position="top-right"
        content={"Detalhes da Venda"}
        trigger={
          <CgDetailsMore
            size={25}
            className="icon"
            onClick={() => {
              setSelectedId(bill?.id);
              setDetailsVisible(true);
            }}
          />
        }
      />

      {removeBillPermission && (
        <Popconfirm
          idTooltip="removebill"
          title={`Confirma exclusao da venda ${bill?.tag}?`}
          onConfirm={() => removeBill()}
          position="top-left"
        >
          <Tooltip
            idTooltip="test"
            enableHover
            position="top-right"
            content={"Excluir Venda"}
            trigger={<FiTrash2 className="icon" />}
          />
        </Popconfirm>
      )}

      <Modal
        open={detailsVisible}
        styles={{ maxWidth: 1400, width: "100%" }}
        onClose={() => {
          setSelectedId(false);
          setDetailsVisible(false);
        }}
      >
        <PageWrapper title="Detalhes da Venda">
          <Details billId={selectedId} setVisible={setDetailsVisible} />
        </PageWrapper>
      </Modal>
    </Container>
  );
}

export default BillActions;
