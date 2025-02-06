import { Modal, notification, Radio, Space } from "antd";
import { LoadingSkeleton } from "@/OLD/components/mini-components";
import { Button, useToast } from "infinity-forge";
import React from "react";
import { sessionService } from "@/OLD/services/session.service";
import { sortItems } from "@/OLD/utils/sortItems";
import { useRouter } from "next/router";

export function ChooseClinic({ login, data, clinics }) {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [dataWithClinic, setDataWithClinic] = React.useState({
    email: data.email,
    password: data.password,
    business_unit_id: "",
    ipAddress: data.ipAddress,
  });

  const router = useRouter();

  const { createToast } = useToast();

  sortItems(clinics, "identification");

  const optionsChild = clinics.map((clinic, key) => {
    return (
      <Radio value={clinic.id} key={key}>
        {clinic?.identification
          ? `${clinic?.identification} (${clinic?.economicGroup})`
          : "Clinica nao identificada"}
      </Radio>
    );
  });

  const handleOk = React.useCallback(async () => {
    setLoading(true);

    if (dataWithClinic.business_unit_id === "") {
      setLoading(false);

      createToast({
        status: "error",
        message: "Escolha uma clinica para concluir o login!",
      });
    }
    try {
      const res = await sessionService.login(dataWithClinic);
      login(res);
      setLoading(false);
      setVisible(false);
    } catch (err: any) {
      if (err?.response?.data?.message?.includes("E_IP_NOT_ALLOWED")) {
        createToast({
          status: "error",
          message: "Ip não autorizado para login",
        });
      }

      setLoading(false);
    }
  }, [dataWithClinic]);

  return (
    <>
      <LoadingSkeleton active={loading} />
      <Modal
        visible={visible}
        title="Selecione a clinica em que deseja entrar"
        onOk={() => handleOk()}
        onCancel={() => router.reload()}
        footer={[<Button text="Entrar" loading={loading} onClick={handleOk} />]}
      >
        <Radio.Group
          onChange={(e) => {
            setDataWithClinic({
              ...dataWithClinic,
              business_unit_id: e.target.value,
            });
          }}
          value={dataWithClinic.business_unit_id}
        >
          <Space direction="vertical">{optionsChild}</Space>
        </Radio.Group>
      </Modal>
    </>
  );
}
