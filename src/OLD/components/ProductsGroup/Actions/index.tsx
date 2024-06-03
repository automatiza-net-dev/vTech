// @ts-nocheck
import React, { memo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { productService } from "@/OLD/services/product.service";

import { useShowProductGroup } from "@/OLD/hooks/useProductGroup";

import CreateOrUpdateForm from "./CreateOrUpdateForm";
import AddOrRemoveItem from "./AddOrRemoveItem";
import { notification } from "antd";

import moment from "moment";

const Actions = memo(function Actions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [kit, setKit] = useState(false);
  const [reload, setReload] = useState(false);
  const [action, setAction] = useState("create");

  const { productGroup } = useShowProductGroup(kit?.id, reload);

  const formatData = () => {
    setData({
      ...data,
      id: productGroup?.id,
      description: productGroup?.description,
      toExpiration: productGroup?.to_expiration
        ? moment(productGroup?.to_expiration)
        : productGroup?.to_expiration,
      fromExpiration: productGroup?.from_expiration
        ? moment(productGroup?.from_expiration)
        : productGroup?.from_expiration,
      items: productGroup?.items,
      active: productGroup?.active,
    });
    setAction("update");
  };

  useEffect(() => {
    productGroup?.id && formatData();
  }, [productGroup]);

  useEffect(() => {
    if (router.query.innerpage) {
      setKit({ id: router.query.innerpage });
      setAction("update");
    }
  }, [router.query.innerpage]);

  const createKit = useCallback(() => {
    setLoading(true);
    productService
      .createProductGroup({
        ...data,
        fromExpiration: data?.fromExpiration
          ? moment(data?.fromExpiration).toISOString()
          : null,
        toExpiration: data?.toExpiration
          ? moment(data?.toExpiration).toISOString()
          : null,
      })
      .then((res) => {
        setKit(res.data);

        setReload((prv) => !prv);
        notification.success({ message: "Kit criado com sucesso!" });
      })
      .catch((_err) => {
        setLoading(false);
        setReload((prv) => !prv);
        notification.error({
          message: "Erro ao cadastrar kit, verifique os campos informados",
        });
      })
      .finally(() => setLoading(false));
  }, [data]);

  const updateKit = useCallback(() => {
    setLoading(true);
    productService
      .updateProductGroup(data?.id, {
        description: data?.description,
        fromExpiration: data?.fromExpiration
          ? moment(data?.fromExpiration).toISOString()
          : null,
        toExpiration: data?.toExpiration
          ? moment(data?.toExpiration).toISOString()
          : null,
        active: data?.active,
      })
      .then((_res) => {
        setReload((prv) => !prv);
        notification.success({ message: "Kit atualizado com sucesso!" });
        router.back();
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Verifique os campos informados",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data]);

  return (
    <div className="uk-padding">
      <section>
        <h3 className="uk-margin-remove">
          {router?.query?.subpage === "editar"
            ? "Editar kit"
            : "Cadastro de kit"}
        </h3>
      </section>
      <CreateOrUpdateForm
        data={data}
        setData={setData}
        action={action}
        submit={createKit}
      />
      {kit && (
        <AddOrRemoveItem
          kit={data}
          setKit={setKit}
          setReload={setReload}
          reload={reload}
          action={action}
          update={updateKit}
          loadingUpdate={loading}
        />
      )}
    </div>
  );
});

export default Actions;
