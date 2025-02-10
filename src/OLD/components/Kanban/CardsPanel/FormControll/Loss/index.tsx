// @ts-nocheck
import { memo, useCallback, useState } from "react";

import { useGetAllReasons } from "@/OLD/hooks/useReasons";
import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { Modal } from "antd";
import FormChild from "../FormChild";
import { useToast } from "infinity-forge";

const Loss = memo(function ({ formData, visible, close, setReload }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const { data: reasons } = useGetAllReasons({
    enabled: visible,
    params: { type: "crm_perda" },
  });

  const {createToast} = useToast()

  const submitLoss = useCallback(() => {
    setLoading(true);

    if (!data?.selectedId) {
      return createToast({ status: "error",  message: "Informe o motivo da perda" })
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
        return  createToast({ status: "success",  message: "Perda informada com sucesso!" })
      })
      .catch((_err) => {
        setLoading(false);
        return  createToast({ status: "success",  message: "Houve um erro ao informar a perda..." })
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
