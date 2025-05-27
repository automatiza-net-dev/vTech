// @ts-nocheck
import React, { useState, memo, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { servicesService } from "@/OLD/services/services.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import { VscTasklist } from "react-icons/vsc";

import { Popconfirm, Modal } from "antd";
import EditForm from "./EditForm";
import ProductivityItems from "@/OLD/components/mini-components/ProductivityItems";
import ServiceDetails from "../Single";
import { useToast } from "infinity-forge";

const verifyErrors = (msg) => {
  const fields = msg?.map((item) => item?.field);

  if (fields?.includes("subgroupId")) {
    return "Campo subgrupo obrigatório";
  }

  if (fields?.includes("taxationGroupId")) {
    return "campo grupo de imposto obrigatório";
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
  const { createToast } = useToast();

  const router = useRouter();

  const removeService = useCallback(() => {
    if (!canDeleteService) {
      return createToast({ message: "Ação não permitida", status: "error" });
    }

    servicesService
      .removeService(service.id)
      .then((_res) =>
        createToast({
          message: "Serviço removido com sucesso!",
          status: "success",
        })
      )
      .catch((err) =>
        createToast({
          message: "Houve um erro ao remover o serviço selecionado",
          status: "error",
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
        createToast({
          message: "Serviço atualizado com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        const message = verifyErrors(err?.response?.data?.errors);
        createToast({ message, status: "warning" });

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
      <FiEdit2
        onClick={() => {
          setServiceId(service?.id);
          setDetailsVisible(true);
          {
            /* router.push(`/dashboard/servico/${service?.id}`); */
          }
        }}
        style={{ cursor: 'pointer', fontSize: '1.2rem' }}
      />
      <VscTasklist
        onClick={() => {
          setServiceId(service?.id);
          setProductivityVisible(true);
        }}
      />

      {/*canEditService && <FiEdit2 onClick={() => setUpdateVisible(true)} />*/}
      <Popconfirm
        title="Deseja remover esse serviço?"
        onConfirm={removeService}
        okText="Sim"
        cancelText="Não"
        placement="left"
      >
        {canDeleteService && (
          <FiTrash2
            className="uk-link"
            style={{ cursor: 'pointer', fontSize: '1.2rem', color: 'red' }}
          />
        )}
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
