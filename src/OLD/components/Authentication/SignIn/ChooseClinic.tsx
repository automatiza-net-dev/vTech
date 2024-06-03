import { Button, Modal, notification, Radio, Space } from "antd";
import { LoadingSkeleton } from "@/OLD/components/mini-components";
import React from "react";
import { sessionService } from "@/OLD/services/session.service";
import { sortItems } from "@/OLD/utils/sortItems";
import { useRouter } from "next/router";

const verifyErrors = (msg) => {
  if (msg?.includes("E_IP_NOT_ALLOWED")) {
    return notification.error({ message: "Ip não autorizado para login" });
  }
};

export function ChooseClinic({
  login,
  data,
  clinics
}) {
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [dataWithClinic, setDataWithClinic] = React.useState({
    email: data.email,
    password: data.password,
    business_unit_id: "",
    ipAddress: data.ipAddress
  });

  const router = useRouter();

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
      return notification.error({
        message: "Erro",
        description: "Escolha uma clinica para concluir o login!"
      });
    }
    try {
      const res = await sessionService.login(dataWithClinic);
      login(res);
      setLoading(false);
      setVisible(false);
    } catch (err: any) {
      verifyErrors(err?.response?.data?.message);
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
        footer={[
          <Button type="primary" loading={loading} onClick={handleOk}>
            Entrar
          </Button>
        ]}
      >
        <Radio.Group
          onChange={(e) => {
            setDataWithClinic({
              ...dataWithClinic,
              business_unit_id: e.target.value
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