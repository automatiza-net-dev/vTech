// @ts-nocheck
import * as React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";

import { billService } from "@/OLD/services/bills.service";

import { useDailyCasher } from "@/OLD/hooks/useDailyCashiers";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { CgDetailsMore } from "react-icons/cg";
import { FiLock, FiUnlock } from "react-icons/fi";
import { DeleteTwoTone } from "@ant-design/icons";

import { Tooltip, notification, Popconfirm, Modal } from "antd";
import AddBillItem from "./AddBillItem";
import ConvertBillToTreatment from "./ConvertBillToTreatment";
import Details from "./Details";
import AddBillPayment from "@/OLD/components/Bill/Actions/AddBillPayment";

import moment from "moment";
import { MdMonetizationOn } from "react-icons/md";

import { ModalListagemDocumentosVenda } from "./modal-listagem-documentos-venda";
import { GerarDocumentoVenda } from "./gerar-documento-venda";

const Container = styled.div`
  display: flex;
  gap: 0.75rem;

  .icon {
    cursor: pointer;
  }
`;

const BillActions = React.memo(function BillActions({
  bill,
  client,
  setReload = false,
  cashiers,
}) {
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

  const closeBill = React.useCallback(() => {
    billService
      .closeBillPayment(bill?.id)
      .then((_res) =>
        notification.success({ message: "Venda finalizada com sucesso!" })
      )
      .catch((err) => {
        notification.error({
          message:
            "houve um erro ao finalizar a venda, verifique se ainda há valores pendentes",
        });
      })
      .finally(() => {
        queryClient.invalidateQueries(["bills"]);
        setReload && setReload((prv) => !prv);
      });
  }, [bill?.id]);

  const reopenBillPayment = React.useCallback(() => {
    billService
      .reopenBillPayment(bill?.id)
      .then((_res) =>
        notification.success({ message: "Venda reaberta com sucesso!" })
      )
      .catch((_err) =>
        notification.error({
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
        return notification.success({
          message: "Nota de saída removida com sucesso!",
        });
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          return notification.error({
            message: err.response.data.message.replace("E_ERR:", ""),
          });
        }

        return notification.error({
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
      {(bill?.status === "ABERTA" || bill?.status === "Venda em Aberto") && (
        <>
          <AddBillItem bill={bill} />
          {addPaymentPermission && (
            <Tooltip title="Adicionar Pagamento">
              <MdMonetizationOn
                className="icon"
                size={20}
                onClick={() => {
                  if (cashiers.length === 0) {
                    return notification.warning({
                      message: "Nenhum caixa diário aberto",
                    });
                  }
                  setSelectedId(bill?.id);
                  setPaymentsVisible(true);
                }}
              />
            </Tooltip>
          )}
        </>
      )}
      {(bill?.status === "ABERTA" || bill?.status === "Venda em Aberto") &&
        finishBillPermission && (
          <Tooltip title="Finalizar venda">
            <Popconfirm
              title="Deseja finalizar essa venda?"
              onConfirm={() => closeBill()}
            >
              <FiLock size={20} className="icon" />
            </Popconfirm>
          </Tooltip>
        )}
      {(bill?.status === "BAIXADA" || bill?.status === "Venda Finalizada") && (
        <>
          {reopenBillPermission && (
            <Tooltip title="Reabrir venda">
              <Popconfirm
                title="Deseja reabrir essa venda?"
                onConfirm={() => reopenBillPayment()}
              >
                <FiUnlock size={20} className="icon" />
              </Popconfirm>
            </Tooltip>
          )}
        </>
      )}
      {convertTreatmentPermission && (
        <ConvertBillToTreatment bill={bill} setReload={setReload} />
      )}

      <GerarDocumentoVenda bill={bill} client={client} />

      <ModalListagemDocumentosVenda bill={bill} />

      <Tooltip title="Detalhes da nota">
        <CgDetailsMore
          size={25}
          className="icon"
          onClick={() => {
            setSelectedId(bill?.id);
            setDetailsVisible(true);
            // router.push(`/dashboard/vendas/detalhes/${bill?.id}`);
          }}
        />
      </Tooltip>
      {removeBillPermission && (
        <Popconfirm
          title="Deseja remover essa nota de saída?"
          onConfirm={() => removeBill()}
        >
          <DeleteTwoTone twoToneColor={"red"} className="icon" />
        </Popconfirm>
      )}
      {detailsVisible && (
        <Modal
          title="Detalhes da venda"
          visible={detailsVisible}
          footer={null}
          width={1400}
          onCancel={() => {
            setSelectedId(false);
            setDetailsVisible(false);
          }}
        >
          <Details billId={selectedId} setVisible={setDetailsVisible} />
        </Modal>
      )}
      {paymentsVisible && (
        <Modal
          width={1500}
          visible={paymentsVisible}
          footer={null}
          onCancel={() => setPaymentsVisible(false)}
        >
          <AddBillPayment billId={selectedId} setVisible={setPaymentsVisible} />
        </Modal>
      )}
    </Container>
  );
});

export default BillActions;
