// @ts-nocheck
import React, { memo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { supplierService } from "@/OLD/services/supplier.service";

import { useSingleSupplier } from "@/OLD/hooks/useSuppliers";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { notification } from "antd";
import FormChild from "../FormChild";
import { PageWrapper } from "infinity-forge";
import AccessDenied from "@/OLD/components/AccessDenied";

export function EditSupplier() {
  const [data, setData] = useState({});
  const [photo, setPhoto] = useState();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const id = router?.query?.id;

  const { supplier } = useSingleSupplier(id);
  const editSupplierPermission = useUserHasPermission("FOR02");

  const formatUpdateData = () => {
    const { tutor } = supplier;

    setData({
      name: supplier?.name,
      corporateName: tutor?.corporate_name,
      active: supplier?.active,
      document: tutor?.document,
      inscription: tutor?.inscription,
      telephone: tutor?.telephone,
      cellphone: tutor?.cellphone,
      email: tutor?.email,
      tag: supplier?.tag,
      postalCode: tutor?.postal_code,
      street: tutor?.street,
      number: tutor?.number,
      complement: tutor?.complement,
      district: tutor?.district,
      state: tutor?.state,
      city: tutor?.city,
      residence: tutor?.residence,
      cityCode: tutor?.city_code,
      accountPlanId: tutor?.accountPlan?.id,
      planDesc: tutor?.accountPlan?.description,
    });
  };

  useEffect(() => {
    supplier && formatUpdateData();
  }, [supplier]);

  const submit = useCallback(() => {
    if (!data?.corporateName) {
      setLoading(false);
      return notification.warning({
        message: "Informe a sua razão social",
      });
    }

    setLoading(true);
    supplierService
      .update(supplier?.id, data)
      .then((_res) => {
        notification.success({ message: "fornecedor atualizado com sucesso" });
        router.back();
      })
      .catch((_err) => {
        setLoading(false);
        notification.error({ message: "houve um erro ao editar o fornecedor" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data]);

  return !editSupplierPermission ? (
    <AccessDenied />
  ) : (
    <PageWrapper title="Editar Fornecedor">
      <div>
        <FormChild
          data={data}
          setData={setData}
          submit={submit}
          setPhoto={setPhoto}
        />
      </div>
    </PageWrapper>
  );
}
