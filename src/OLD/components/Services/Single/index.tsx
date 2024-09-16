// @ts-nocheck
import React, { memo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";

import { servicesService } from "@/OLD/services/services.service";

import { Container } from "./styles";
import { Table, notification } from "antd";
import { Button, PageWrapper } from "infinity-forge";
import Header from "./Header";
import Edit from "./Edit";

import { servicesDetailsColumns } from "./Columns";
import { currencyFormatter } from "@/OLD/components/Budget";

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

const Single = memo(function Single({
  setVisible,
  serviceId,
  setReloadService,
}) {
  const [service, setService] = useState({});
  const [loading, setLoading] = useState(false);
  const [formatedServiceUnits, setFormatedServiceUnits] = useState([]);
  const [reload, setReload] = useState(false);

  const router = useRouter();

  const getService = useCallback(() => {
    setLoading(true);
    servicesService
      .showService(serviceId)
      .then((res) => {
        setService({
          id: res?.data?.id,
          courtesy: res?.data?.courtesy,
          originalDescription: res.data?.description,
          description: res?.data?.description,
          referenceCode: res?.data?.reference_code,
          variationGroup: res.data?.variationGroup?.id,
          subgroupId: res.data?.subgroup?.id,
          subgroupDescription: res.data?.subgroup?.description,
          taxationGroupId: res.data?.taxationGroup?.id,
          taxationGroupDescription: res.data?.taxationGroup?.name,
          type: res.data?.type,
          active: res.data?.active,
          features: res.data?.features,
          serviceCode: res.data?.service_code,
          variations: res.data?.variations,
          serviceType: res?.data?.type,
        });
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [serviceId, reload]);

  const formatServiceUnits = () => {
    service?.variations?.length > 0 &&
      service?.variations[0]?.businessUnitProducts?.length > 0 &&
      service?.variations[0]?.businessUnitProducts.sort((a, b) => {
        if (
          a.businessUnit?.fantasy_name.toLowerCase() <
          b.businessUnit?.fantasy_name.toLowerCase()
        ) {
          return -1;
        }

        if (
          a.businessUnit?.fantasy_name.toLowerCase() >
          b.businessUnit?.fantasy_name.toLowerCase()
        ) {
          return 1;
        }

        return 0;
      });

    service?.variations?.length > 0 &&
      service?.variations[0]?.businessUnitProducts?.length > 0 &&
      setFormatedServiceUnits(
        service?.variations[0]?.businessUnitProducts?.map((item) => {
          return {
            unit: item?.businessUnit?.fantasy_name,
            maxDiscountPercentage: `${item?.maximum_discount_percentage}%`,
            maxDiscountValue: currencyFormatter(item?.maximum_discount_value),
            costPrice: currencyFormatter(item?.cost_price),
            profitMargin: item?.profit_margin,
            price: currencyFormatter(item?.price),
            metaType: item?.meta_type === "q" ? "Quantidade" : "Valor",
            commission: item?.commission,
            meta: item?.meta,
            commissionMeta: item?.commission_meta,
            actions: <Edit unitVariation={item} setReload={setReload} />,
          };
        })
      );
  };

  useEffect(() => {
    getService();
  }, [getService]);

  useEffect(() => {
    formatServiceUnits();
  }, [service]);

  const submitUpdate = useCallback(async () => {
    try {
      setLoading(true);
      await servicesService.updateService(service?.id, service);
      setLoading(false);
      setReload((prv) => !prv);
      setVisible(false);
      notification.success({
        message: "Serviço atualizado com sucesso!",
      });
      setLoading(false);
      setReloadService && setReloadService((prv) => !prv);
      return verifyErrors(err?.response?.data?.errors);
    } catch (error) {
      setLoading(false);
    }
  }, [service]);

  return (
    <PageWrapper
      title={`Detalhes do serviço - ${service?.originalDescription}`}
    >
      <Container>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <Button text="Voltar" onClick={() => setVisible(false)} />

          <Button onClick={submitUpdate} text="Salvar" />
        </div>

        <hr />
        <Header service={service} setService={setService} />
        <hr />
        <Table
          columns={servicesDetailsColumns}
          dataSource={formatedServiceUnits}
        />
      </Container>
    </PageWrapper>
  );
});

export default Single;
