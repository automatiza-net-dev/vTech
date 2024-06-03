// @ts-nocheck

// Core
import React, { memo, useState, useCallback, useEffect } from "react";

// Services
import { paymentMethodsService } from "@/OLD/services/paymentMethods.service";

// Hooks
import { useTefAcquirers } from "@/OLD/hooks/useTefAquirers";

// Icons
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

// Components
import InstallmentsPanel from "./InstallmentsPanel";
import { Modal, notification, Input, Select } from "antd";
const { Option } = Select;

const Actions = memo(function Actions({ flag, reload, setReload }) {
  const [loading, setLoading] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [data, setData] = useState({});
  const [installmentsData, setInstallmentsData] = useState([]);

  const { acquirers } = useTefAcquirers();

  useEffect(() => {
    setData({
      tefAcquirerId: flag?.acquirer?.id,
      maxInstallments: flag?.max_installments,
      fee: flag?.fee,
      active: flag?.active,
    });
  }, [flag]);

  const updateFlag = useCallback(() => {
    setLoading(true);
    updateFee();
    paymentMethodsService
      .updateFlag(flag?.id, data)
      .then((_res) =>
        notification.success({
          message: "Informações atualizadas com sucesso!",
        })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao atualizar as informações da bandeira...",
        });
      })
      .finally(() => {
        setLoading(false);
        setUpdateVisible(false);
        setReload(!reload);
      });
  }, [data, flag?.id, installmentsData]);

  const updateFee = () => {
    setLoading(true);
    installmentsData.forEach((installment) =>
      paymentMethodsService.updateFeeFlagInstallments(installment?.id, {
        fee: installment?.fee,
      })
    );

    setReload((prv) => !prv);
  };

  useEffect(() => {
    flag?.installments?.length > 0 &&
      setInstallmentsData(
        flag?.installments.sort((a, b) => a.installment - b.installment)
      );
  }, [flag.installments]);

  return (
    <section className="uk-flex uk-flex-around">
      <EditTwoTone onClick={() => setUpdateVisible(true)} />
      <Modal
        title="Atualizar bandeira"
        visible={updateVisible}
        onCancel={() => setUpdateVisible(false)}
        onOk={() => updateFlag()}
        okText="Salvar Taxas"
        width={700}
      >
        <section>
          {" "}
          <div className="uk-margin-top uk-flex">
            <div className="uk-width-1-2 uk-margin-small-right">
              <label>Adquirente</label>
              <Select
                className="uk-width-1-1"
                value={data?.tefAcquirerId}
                onChange={(e) => setData({ ...data, tefAcquirerId: e })}
              >
                {acquirers?.length > 0 &&
                  acquirers.map((acquirer) => (
                    <Option value={acquirer?.id}>
                      {acquirer?.description}
                    </Option>
                  ))}
              </Select>
            </div>
            <div className="uk-width-1-2 uk-margin-small-right">
              <label>Limite Max. Parcelas</label>
              <Input
                type="number"
                value={data?.maxInstallments}
                onChange={(e) =>
                  setData({ ...data, maxInstallments: e.target.value })
                }
              />
            </div>
            <div className="uk-margin-small-right uk-width-1-2">
              <label>Dias Repasse Adm. Cartão</label>
              <Input type="number" />
            </div>
            {/*
            <div className="uk-width-1-3">
              <label>Taxa Desc. Adm. Cartão</label>
              <Input
                type="number"
                value={data?.fee}
                onChange={(e) => setData({ ...data, fee: e.target.value })}
              />
            </div>
            */}
          </div>
        </section>
        <InstallmentsPanel
          data={installmentsData}
          setData={setInstallmentsData}
        />
      </Modal>
    </section>
  );
});

export default Actions;
