// @ts-nocheck
import React, { memo, useState, useEffect } from "react";
import { useRouter } from "next/router";

import { productService } from "@/OLD/services/product.service";

import { useProductsGroup } from "@/OLD/hooks/useProductGroup";

import { Container } from "./styles";
import { Table, Modal, notification, Popconfirm } from "antd";
import { Button, PageWrapper } from "infinity-forge";
import Filters from "./Filters";
import AccessDenied from "@/OLD/components/AccessDenied";

import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

import { productsGroupColumns } from "./Columns";
import { currencyFormatter } from "@/OLD/components/Budget";
import moment from "moment";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

const ProductsGroup = memo(function ProductsGroup() {
  const [filters, setFilters] = useState({});
  const [formattedProductsGroup, setFormattedProductsGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const router = useRouter();

  const listKitsPermission = useUserHasPermission("KIT00");
  const canCreateKit = useUserHasPermission("KIT01");
  const canEditKit = useUserHasPermission("KIT02");
  const canDeleteKit = useUserHasPermission("KIT03");

  const { productsGroup } = useProductsGroup(filters, reload);

  const removeKit = (id) => {
    setLoading(true);
    productService
      .removeKit(id)
      .then((_res) => {
        setReload((prv) => !prv);
        notification.success({ message: "Kit removido com sucesso" });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message: "Hovue um erro ao remover o kit selecionado",
        });
      });
  };

  const formatProductsGroup = () => {
    setFormattedProductsGroup(
      productsGroup.map((product) => ({
        code: product?.id,
        description: product?.description,
        fromExpiration: product?.fromExpiration
          ? moment(product?.fromExpiration).format("DD/MM/YYYY")
          : "-",
        toExpiration: product?.toExpiration
          ? moment(product?.toExpiration).format("DD/MM/YYYY")
          : "-",
        originalValue: currencyFormatter(product?.sum?.originalPrice),
        salePrice: currencyFormatter(product?.sum?.salePrice),
        discountValue: currencyFormatter(product?.sum?.discountPrice),
        actions: (
          <div className="uk-flex uk-flex-around">
            {canEditKit ? (
              <EditTwoTone
                onClick={() =>
                  router.push(`/dashboard/kits/editar/${product?.id}`)
                }
              />
            ) : null}
            {canDeleteKit ? (
              <Popconfirm
                title="Deseja remover este kit?"
                onConfirm={() => removeKit(product?.id)}
                okText="Sim"
                cancelText="Não"
                placement="left"
              >
                <DeleteTwoTone twoToneColor={"red"} />
              </Popconfirm>
            ) : null}
          </div>
        ),
      }))
    );
  };

  useEffect(() => {
    productsGroup?.length > 0
      ? formatProductsGroup()
      : setFormattedProductsGroup([]);
  }, [productsGroup, canDeleteKit, canEditKit]);

  return !listKitsPermission || listKitsPermission === "loading" ? (
    <AccessDenied loading={listKitsPermission} />
  ) : (
    <PageWrapper title="Kits de produtos/Serviços">
      <Container>
        <Filters filters={filters} setFilters={setFilters} />
        <div className="uk-flex uk-flex-right">
          <Button
            onClick={() => router.push("/dashboard/kits/criar")}
            disabled={!canCreateKit}
            text="Cadastrar"
          />
        </div>
        <hr />
        <div className="uk-margin-top">
          <Table
            columns={productsGroupColumns}
            dataSource={formattedProductsGroup}
          />
        </div>
      </Container>
    </PageWrapper>
  );
});

export default ProductsGroup;
