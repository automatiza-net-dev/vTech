// @ts-nocheck
import React, { memo, useCallback, useState } from "react";
import { useRouter } from "next/router";

import { supplierService } from "@/OLD/services/supplier.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { notification } from "antd";
import FormChild from "../FormChild";
import { PageWrapper } from "infinity-forge";
import AccessDenied from "@/OLD/components/AccessDenied";

const CreateSupplier = memo(function CreateSupplier() {
  const [photo, setPhoto] = useState();
  const [data, setData] = useState({ active: true });
  const [loading, setLoading] = useState(false);

  const createSupplierPermission = useUserHasPermission("FOR01");

  const router = useRouter();

  const submit = useCallback(() => {
    if (!data?.corporateName) {
      setLoading(false);
      return notification.warning({
        message: "Informe a sua razão social",
      });
    }

    if (!data?.name) {
      setLoading(false);
      return notification.warning({
        message: "Informe seu nome fantasia",
      });
    }

    setLoading(true);
    supplierService
      .create({ ...data, photo: photo })
      .then((_res) =>
        notification.success({ message: "Fornecedor cadastrado com sucesso!" })
      )
      .catch((err) => {
        return notification.error({
          message: "verifique os campos informados",
        });
      })
      .finally(() => {
        setLoading(false);
        router.back();
      });
  }, [data]);

  return !createSupplierPermission || createSupplierPermission === "loading" ? (
    <AccessDenied loading={createSupplierPermission} />
  ) : (
    <PageWrapper title="Cadastrar novo fornecedor">

      <FormChild
        submit={submit}
        setPhoto={setPhoto}
        data={data}
        setData={setData}
      />

      </PageWrapper>
  );
});

export default CreateSupplier;
