// @ts-nocheck
import React, { useState, memo, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { servicesService } from "@/OLD/services/services.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { EditTwoTone, DeleteTwoTone, CheckOutlined } from "@ant-design/icons";
import { VscTasklist } from "react-icons/vsc";

import { notification, Popconfirm, Modal } from "antd";
import EditForm from "./EditForm";
import ProductivityItems from "@/OLD/components/mini-components/ProductivityItems";
import ServiceDetails from "../Single";

const verifyErrors = (msg) => {
  const fields = msg?.map((item) => item?.field);

  if (fields?.includes("subgroupId")) {
    return notification.warning({ message: "Campo subgrupo obrigatório" });
  }

  if (fields?.includes("taxationGroupId")) {
    return notification.warning({
      message: "campo grupo de imposto obrigatório",
    });
  }
};

const Actions = memo(function Actions({ service, setReload }) {
  const [data, setData] = useState({});
  const [updateVisible, setUpdateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productivityVisible, setProductivityVisible] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);

  const canEditService = useUserHasPermission("SRV02");
  const canDeleteService = useUserHasPermission("SRV03");

  const router = useRouter();

  const removeService = useCallback(() => {
    if (!canDeleteService) {
      return notification.error({ message: "Ação não permitida" });
    }

    servicesService
      .removeService(service.id)
      .then((_res) =>
        notification.success({ message: "Serviço removido com sucesso!" })
      )
      .catch((err) =>
        notification.error({
          message: "Houve um erro ao remover o serviço selecionado",
        })
      )
      .finally(() => {
        setReload((prv) => !prv);
      });
  }, [service?.id]);

  const setUpdateData = () => {
    setData({
      courtesy: service?.courtesy,
      description: service?.description,
      active: `${service?.active}`,
      referenceCode: service?.referenceCode,
      subgroupId: service?.subgroup?.id,
      taxationGroupId: service?.taxationGroup?.id,
      features: service?.features,
      serviceCode: service?.serviceCode,
      serviceType: service?.type,
      serviceTyé: service.serviceType,
    });
  };

  useEffect(() => {
    updateVisible && setUpdateData();
  }, [updateVisible]);

  const updateService = useCallback(() => {
    let error = false;
    setLoading(true);
    servicesService
      .updateService(service?.id, {
        ...data,
        active: data?.active === "true" ? true : false,
      })
      .then((_res) =>
        notification.success({ message: "Serviço atualizado com sucesso!" })
      )
      .catch((err) => {
        verifyErrors(err?.response?.data?.errors);
        error = true;
        setLoading(false);
      })
      .finally(() => {
        if (!error) {
          setData({});
          setUpdateVisible(false);
          setReload((prv) => !prv);
        }
      });
  }, [data, service?.id]);

  return (
    <section className="uk-flex uk-flex-around">
        <CheckOutlined
          onClick={() => {
            setServiceId(service?.id);
            setDetailsVisible(true);
            {
              /* router.push(`/dashboard/servico/${service?.id}`); */
            }
          }}
        />
        <VscTasklist
          onClick={() => {
            setServiceId(service?.id);
            setProductivityVisible(true);
          }}
        />

      {/*canEditService && <EditTwoTone onClick={() => setUpdateVisible(true)} />*/}
      <Popconfirm
        title="Deseja remover esse serviço?"
        onConfirm={removeService}
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
        {canDeleteService && <DeleteTwoTone twoToneColor="red" />}
      </Popconfirm>
      <Modal
        width={800}
        title="Alterar dados do serviço"
        footer={null}
        visible={updateVisible}
        onCancel={() => setUpdateVisible(false)}
      >
        <EditForm
          data={data}
          setData={setData}
          submit={updateService}
          setVisible={setUpdateVisible}
        />
      </Modal>
      {productivityVisible && (
        <Modal
          title={`Items de produtividade: [item]`}
          visible={productivityVisible}
          onCancel={() => setProductivityVisible(false)}
          footer={null}
        >
          <ProductivityItems productId={serviceId} />
        </Modal>
      )}
      {detailsVisible && (
        <Modal
          visible={detailsVisible}
          onCancel={() => setDetailsVisible(false)}
          width={1200}
          footer={null}
        >
          <ServiceDetails
            setReloadService={setReload}
            serviceId={service?.id}
            setVisible={setDetailsVisible}
          />
        </Modal>
      )}
    </section>
  );
});

export default Actions;
