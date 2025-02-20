// @ts-nocheck
import React, { memo, useCallback, useState } from "react";
import { useRouter } from "next/router";

import { supplierService } from "@/OLD/services/supplier.service";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import FormChild from "../FormChild";
import { PageWrapper, useToast } from "infinity-forge";
import AccessDenied from "@/OLD/components/AccessDenied";

const CreateSupplier = memo(function CreateSupplier() {
  const [photo, setPhoto] = useState();
  const [data, setData] = useState({ active: true });
  const [loading, setLoading] = useState(false);

  const createSupplierPermission = useUserHasPermission("FOR01");

  const router = useRouter();
  const { createToast } = useToast();

  const submit = useCallback(() => {
    if (!data?.corporateName) {
      setLoading(false);

      return createToast({
        message: "Informe a sua razão social",
        status: "warning",
      });
    }

    if (!data?.name) {
      setLoading(false);
      return createToast({
        message: "Informe seu nome fantasia",
        status: "warning",
      });
    }

    setLoading(true);
    supplierService
      .create({ ...data, photo: photo })
      .then((_res) =>
        createToast({
          message: "Fornecedor cadastrado com sucesso!",
          status: "success",
        })
      )
      .catch((err) => {
        createToast({
          message: "verifique os campos informados",
          status: "error",
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
