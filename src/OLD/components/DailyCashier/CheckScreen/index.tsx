// @ts-nocheck
import React, { memo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { dailyCasherService } from "@/OLD/services/dailyCasher.service";
import { billService } from "@/OLD/services/bills.service";

import { useInfoDailyCasher } from "@/OLD/hooks/useDailyCashiers";
import { useProfile } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import Header from "./Header";
import {
  Table,
  Button,
  Switch,
  Popconfirm,
  notification,
  Modal,
  Input,
} from "antd";
const { TextArea } = Input;

import { checkingCashierColumns } from "./Columns";
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";

function CheckScreen() {
  const [formattedPayments, setFormattedPayments] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [observationsData, setObservationsData] = useState({});

  const router = useRouter();

  const { info } = useInfoDailyCasher(router.query.innerpage);
  const { user } = useProfile();

  const formatPayments = () => {
    setFormattedPayments(
      info?.cashier?.payments?.map((payment) => ({
        code: payment?.tag,
        block: payment?.block,
        bill_id: payment?.bill_id,
        client: payment?.name,
        paymentMethod: `${payment?.payment_method}/${payment?.flag || "-"}`,
        value: currencyFormatter(payment?.sum),
        NSU: payment?.nsu_document || "-",
        installments: payment?.qty_installments,
        checked: (
          <Switch
            checked={
              data?.find(
                (item) =>
                  item?.block === payment?.block &&
                  item?.bill_id === payment?.bill?.id
              )?.conference
            }
            onChange={(val) => {
              val
                ? setData(
                    data?.map((item) => {
                      if (
                        item?.block === payment?.block &&
                        item?.bill_id === payment?.bill?.id
                      ) {
                        return { ...item, conference: true };
                      }
                      return { ...item };
                    })
                  )
                : setData(
                    data?.map((item) => {
                      if (
                        item?.block === payment?.block &&
                        item?.bill_id === payment?.bill?.id
                      ) {
                        return { ...item, conference: false };
                      }
                      return { ...item };
                    })
                  );
            }}
          />
        ),
      }))
    );
  };

  const submitClearConference = useCallback(() => {
    setLoading(true);
    dailyCasherService
      .clearPayments({
        dailyCashierId: router.query.innerpage,
        items: formattedPayments
          .map((item) => {
            if (!data?.includes(`${item?.bill_id}-${item?.block}`)) {
              return item?.id;
            }
          })
          .filter((item) => item),
      })
      .then((_res) => {
        setLoading(false);
        return notification.success({ message: "itens enviados com sucesso!" });
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [data]);

  const submitConfirmedConference = useCallback((cb = false) => {
    setLoading(true);
    billService
      .updateConferencePayment({
        dailyCashierId: router.query.innerpage,
        items: [...data],
      })
      .then((_res) => {
        setLoading(false);
        cb && cb();
        return notification.success({
          message: "Itens conferidos com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
      });
  });

  const submitCompleteCheckCashier = (observationsData) => {
    setLoading(true);
    dailyCasherService
      .checkDailyCasher(router.query.innerpage, {
        userId: user?.id,
        checkingDate: moment(new Date()).toISOString(),
        observations: observationsData?.observation,
      })
      .then((_res) => {
        setLoading(false);
        notification.success({ message: "Caixa conferido com sucesso!" });
        router.back();
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  const submitReviewCashier = (observationsData) => {
    dailyCasherService
      .reviewDailyCasher(router.query.innerpage, {
        userId: user?.id,
        revisionDate: moment(new Date()).toISOString(),
        observations: observationsData?.observation,
      })
      .then((_res) => {
        setLoading(false);
        notification.success({
          message: "Caixa revisão solicitada com sucesso!",
        });
        router.back();
      })
      .catch((_err) => {
        setLoading(false);
      });
  };

  const selectAll = (val) => {
    setData((prv) => prv?.map((item) => ({ ...item, conference: val })));
  };

  useEffect(() => {
    formatPayments();
  }, [info, data]);

  useEffect(() => {
    setData(
      info?.cashier?.payments?.map((payment) => {
        return {
          billId: payment?.bill_id,
          block: payment?.block,
          conference: !!payment?.conference_date,
        };
      })
    );
  }, [info]);

  return (
    <Container className="uk-padding">
      <Header cashier={info?.cashier} />
      <hr />
      <div className="table-div">
        <Table
          columns={checkingCashierColumns(selectAll)}
          dataSource={formattedPayments}
          className="uk-margin-top"
          pagination={false}
        />
      </div>
      <hr />
      <footer className="uk-flex uk-flex-right">
        <Popconfirm
          title={`Confirmar conferência de ${data?.length} Items?`}
          onConfirm={() => {
            submitClearConference();
            submitConfirmedConference(router.back);
          }}
        >
          <Button className="uk-margin-small-right" type="primary">
            Salvar e continuar depois
          </Button>
        </Popconfirm>
        <Button
          className="uk-margin-small-right"
          type="primary"
          onClick={() =>
            setObservationsData({
              ...observationsData,
              visible: true,
              title: `Revisão caixa Nº ${info?.cashier?.tag}`,
              submit: submitReviewCashier,
            })
          }
        >
          Revisão
        </Button>
        <Button
          className="uk-margin-small-right"
          type="primary"
          onClick={() => {
            if (
              formattedPayments
                .map((item) => {
                  if (!data?.includes(`${item?.bill_id}-${item?.block}`)) {
                    return `${item?.bill_id}-${item?.block}`;
                  }
                })
                .filter((item) => item).length > 0
            ) {
              return notification.warning({
                message: "Ainda há pagamentos pendentes para conferência",
              });
            }

            setObservationsData({
              ...observationsData,
              visible: true,
              title: `Conferência completa caixa Nº ${info?.cashier?.tag}`,
              submit: submitCompleteCheckCashier,
            });
          }}
        >
          Conferido
        </Button>
        <Popconfirm
          title="Descartar alterações ?"
          onConfirm={() => {
            router.back();
          }}
        >
          <Button>Cancelar</Button>
        </Popconfirm>
      </footer>
      <Modal
        visible={observationsData?.visible}
        title={observationsData?.title}
        onCancel={() => setObservationsData({})}
        onOk={() => observationsData?.submit(observationsData)}
      >
        <div>
          <label>Observação:</label>
          <TextArea
            value={observationsData?.observation}
            onChange={(e) =>
              setObservationsData({
                ...observationsData,
                observation: e.target.value,
              })
            }
          />
        </div>
      </Modal>
    </Container>
  );
};

export default CheckScreen;
