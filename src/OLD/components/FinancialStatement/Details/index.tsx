// @ts-nocheck
import { memo, useState, useEffect, useCallback } from "react";

import { financesService } from "@/OLD/services/finances.service";

import { useRouter } from "next/router";
import { usePaymentGroup } from "@/OLD/hooks/useFinances";
import { useAuth } from "@/OLD/hooks/useAuth";

import { Container } from "./styles";
import { Button, useToast } from "infinity-forge";
import { Input, Table, Modal, Popconfirm } from "antd";
import FinancesActions from "../Actions";
import DownFormChild from "../Actions/FormChild";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { columns } from "./Columns";
import moment from "moment";

function BorderoDetails({
  groupData,
  setVisible,
  setGroupData,
  reload,
  setReload,
  checkingAccountId,
}: any) {
  const [loading, setLoading] = useState(false);
  const [formattedTitles, setFormattedTitles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [downData, setDownData] = useState({});
  const [downVisible, setDownVisible] = useState(false);

  const router = useRouter();

  const { createToast } = useToast();

  const { titles, setTitles } = useAuth();
  const { finances } = usePaymentGroup(groupData, reload);

  const selectAllFinances = (select) => {
    if (select) {
      setTitles(
        finances?.filter(
          (finance, i) =>
            i >= (currentPage - 1) * 10 &&
            currentPage < currentPage * 10 &&
            finance?.source === "FINANCE"
        )
      );
    } else {
      setTitles([]);
    }
  };

  const formatTitles = () => {
    setFormattedTitles(
      finances?.map((finance) => ({
        doc: finance?.document,
        installments: finance?.installment,
        flag: finance?.tef_flag || "-",
        originalValue: currencyFormatter(finance?.total_value),
        paymentMethod: finance?.payment_method,
        tariffPercentage: finance?.fee_percentage,
        tariffValue: currencyFormatter(finance?.fee_discount_value),
        value: currencyFormatter(finance?.value),
        nsu: finance?.nsu_document || "-",
        feeValue: currencyFormatter(finance?.fee_value),
        feePercentage: finance?.fee_percentage,
        actions: finance?.source === "FINANCE" && (
          <FinancesActions
            financeId={finance?.id}
            reload={reload}
            setReload={setReload}
            type={finance.type}
            completeFinance={finance}
          />
        ),
      }))
    );
  };

  useEffect(() => {
    finances.length > 0 && formatTitles();
    setTitles(finances?.filter((title) => title?.status === "ABERTO"));
  }, [finances]);

  useEffect(() => {
    setDownData({
      paymentMethodId: finances[0]?.payment_method_id,
      tefFlagId: finances[0]?.tef_flag_id,
      tefAcquirerId: finances[0]?.tef_acquirer_id,
      paymentDate: moment(),
      checkingAccountId,
    });
  }, [finances, checkingAccountId]);

  const downSelectedTitles = useCallback(() => {
    setLoading(true);
    financesService
      .groupedDown({
        idList: titles?.map((title) => title?.id),
        tefAcquirerId: finances[0]?.tef_acquirer_id,
        checkingAccountId: downData?.checkingAccountId,
      })
      .then((_res) => {
        setLoading(false);
        setDownVisible(false);
        setGroupData((prv) => ({
          ...prv,
          paymentDate: moment().format("YYYY-MM-DD"),
        }));
        setReload((prv) => !prv);

        return createToast({
          status: "success",
          message: "Títulos baixados com sucesso!",
        });
      })
      .catch((err) => {
        const errMessage = err?.response?.data?.errors;
        if (errMessage) {
          return createToast({
            status: "error",
            message: errMessage[0].message,
          });
        }
      });
  }, [titles, finances, downData]);

  const downGroupTitles = useCallback(() => {
    setLoading(true);

    financesService
      .groupedDown({
        idList: [],
        tef: downData?.tef,
        paymentMethodId: downData?.paymentMethodId,
        tefFlagId: downData?.tefFlagId,
        tefAcquirerId: downData?.tefAcquirerId,
        paymentDate: moment(downData?.paymentDate).format("YYYY-MM-DD"),
        type: finances[0]?.type,
        expirationDate: moment(finances[0]?.expiration_date).format(
          "YYYY-MM-DD"
        ),
      })
      .then((_res) => {
        setLoading(false);
        router.back();
        setDownVisible(false);
        setGroupData((prv) => ({
          ...prv,
          paymentDate: moment().format("YYYY-MM-DD"),
        }));

        return createToast({
          status: "success",
          message: "Grupo baixado com sucesso!",
        });
      })
      .catch((err) => {
        const errMessage = err?.response?.data?.errors;
        if (errMessage) {
          return createToast({
            status: "error",
            message: errMessage[0].message,
          });
        }
      });
  }, [finances, downData]);

  return (
    <Container className="uk-padding-small">
      <h3 className="uk-margin-remove">
        Agrupamento de títulos - {finances[0]?.payment_method} -{" "}
        {finances[0]?.tef_flag ? `${finances[0]?.tef_flag} -` : ""}
        {finances[0]?.expiration_date
          ? `Venc.: ${moment(finances[0]?.expiration_date).format(
              "DD/MM/YYYY"
            )}`
          : ""}
      </h3>
      <header
        className="uk-flex uk-margin-small-top uk-width-2-3"
        style={{ gap: "5px" }}
      >
        <div>
          <label>Tipo títulos</label>
          <Input disabled value={finances[0]?.type} />
        </div>
        <div>
          <label>Valor total títulos</label>
          <Input
            disabled
            value={currencyFormatter(
              finances?.reduce((acc, current) => acc + current.total_value, 0)
            )}
          />
        </div>
        <div>
          <label>Valor realizado</label>
          <Input
            disabled
            value={currencyFormatter(
              finances
                ?.filter((finance) => finance?.status === "BAIXADO")
                .reduce((acc, current) => acc + current.total_value, 0)
            )}
          />
        </div>
        <div>
          <label>Valor em aberto</label>
          <Input
            disabled
            value={currencyFormatter(
              finances
                ?.filter((finance) => finance?.status === "ABERTO")
                .reduce((acc, current) => acc + current.total_value, 0)
            )}
          />
        </div>
        <div>
          <label>Qtd títulos</label>
          <Input disabled value={finances?.length} />
        </div>
      </header>
      <hr />
      <Table
        pagination={{ onChange: (page) => setCurrentPage(page) }}
        columns={columns(selectAllFinances)}
        dataSource={formattedTitles}
      />
      <footer
        className="uk-flex uk-flex-right uk-margin-small-top"
        style={{ gap: "10px" }}
      >
        {finances?.filter((title) => title?.status !== "BAIXADO")?.length >
          0 && (
          <>
            {titles?.length > 0 && (
              <Popconfirm
                title="Deseja baixar os títulos selecionados?"
                onConfirm={() => {
                  !checkingAccountId
                    ? setDownVisible(true)
                    : downSelectedTitles();
                }}
              >
                <Button text="Baixar títulos" />
              </Popconfirm>
            )}
          </>
        )}
      </footer>
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Button
          onClick={() => {
            setVisible(false);
            setTitles([]);
          }}
          text="Fechar"
        />
      </footer>
      {downVisible && (
        <Modal
          title="Selecione a conta corrente para baixa"
          visible={downVisible}
          footer={null}
          onCancel={() => setDownVisible(false)}
        >
          <DownFormChild
            data={downData}
            setData={setDownData}
            visible={downVisible}
            setVisible={setDownVisible}
            submit={downSelectedTitles}
          />
        </Modal>
      )}
    </Container>
  );
}

export default BorderoDetails;
