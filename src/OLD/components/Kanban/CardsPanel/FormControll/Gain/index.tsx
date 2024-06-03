// @ts-nocheck
import { memo, useState, useCallback, useEffect } from "react";

import { opportunitiesService } from "@/OLD/services/opportunities.service";
import { useGetAllReasons } from "@/OLD/hooks/useReasons";

import { Modal, notification } from "antd";
import FormChild from "../FormChild";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { currencyFormatter } from "@/OLD/components/Budget";

const Gain = memo(function Gain({ formData, visible, close, setReload }) {
  const [data, setData] = useState({ currencyValue: currencyFormatter(0) });
  const [loading, setLoading] = useState(false);

  const { data: reasons } = useGetAllReasons({
    enabled: visible,
    params: { type: "crm_ganho" },
  });

  const submitGain = useCallback(() => {
    setLoading(true);

    if (!data?.selectedId) {
      return notification.warning({ message: "Informe a razão do ganho" });
    }

    opportunitiesService
      .closeWinning(formData?.op?.id, {
        reasonId: data?.selectedId,
        observation: data?.areaValue,
        value: convertIntlCurrency(data?.currencyValue),
      })
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        setData({ currencyValue: currencyFormatter(0) });
        close();
        return notification.success({ message: "Ganho informado!" });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Houve um erro ao informar o ganho...",
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
        submit={submitGain}
        formData={formData}
        close={close}
        options={reasons}
      />
    </Modal>
  );
});

export default Gain;
