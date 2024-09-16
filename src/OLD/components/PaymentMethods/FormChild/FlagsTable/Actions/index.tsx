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

  const { acquirers } = useTefAcquirers(updateVisible);

  useEffect(() => {
    setData({
      tefAcquirerId: flag?.acquirer?.id,
      maxInstallments: flag?.max_installments,
      fee: flag?.fee,
      active: flag?.active,
      daysUntilTransfer: flag?.days_until_transfer,
      installmentsWithoutPassword: flag?.installments_without_password
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
      {updateVisible && (
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
            <div style={{ display: "flex", gap: "5px" }}>
              <div style={{ width: "70%" }}>
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
              <div style={{ width: "30%" }}>
                <label>Dias Repasse Adm. Cartão</label>
                <Input
                  type="number"
                  value={data?.daysUntilTransfer}
                  onChange={(e) =>
                    setData((prv) => ({
                      ...prv,
                      daysUntilTransfer: e.target.value,
                    }))
                  }
                />
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
          <section style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
            <div style={{ width: "30%" }}>
              <label>N° Max parcelas</label>
              <Input
                type="number"
                value={data?.maxInstallments}
                onChange={(e) =>
                  setData({ ...data, maxInstallments: e.target.value })
                }
              />
            </div>
            <div style={{ width: "30%" }}>
              <label>N° Max. parcelas sem senha</label>
              <Input
                value={data?.installmentsWithoutPassword}
                type="number"
                onChange={(e) =>
                  setData((prv) => ({
                    ...prv,
                    installmentsWithoutPassword: e.target.value,
                  }))
                }
              />
            </div>
          </section>
          <InstallmentsPanel
            data={installmentsData}
            setData={setInstallmentsData}
          />
        </Modal>
      )}
    </section>
  );
});

export default Actions;
