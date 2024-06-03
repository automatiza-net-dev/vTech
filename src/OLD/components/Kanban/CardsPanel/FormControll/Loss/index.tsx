// @ts-nocheck
import { memo, useCallback, useState } from "react";

import { useGetAllReasons } from "@/OLD/hooks/useReasons";
import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { Modal, notification } from "antd";
import FormChild from "../FormChild";

const Loss = memo(function ({ formData, visible, close, setReload }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const { data: reasons } = useGetAllReasons({
    enabled: visible,
    params: { type: "crm_perda" },
  });

  const submitLoss = useCallback(() => {
    setLoading(true);

    if (!data?.selectedId) {
      return notification.warning({ message: "Informe o motivo da perda" });
    }

    opportunitiesService
      .closeLossing(formData?.op?.id, {
        reasonId: data?.selectedId,
        observation: data?.areaValue,
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        close();
        setData({});
        return notification.success({
          message: "Perda informada com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao informar a perda...",
        });
      });
  }, [formData?.op?.id, data]);

  return (
    <Modal
      title={formData?.title}
      footer={null}
      visible={visible}
      onCancel={() => close()}
    >
      <FormChild
        data={data}
        setData={setData}
        submit={submitLoss}
        formData={formData}
        close={close}
        options={reasons}
      />
    </Modal>
  );
});

export default Loss;
