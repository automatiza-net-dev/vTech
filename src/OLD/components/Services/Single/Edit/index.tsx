// @ts-nocheck
import React, { memo, useState, useEffect, useCallback } from "react";

import { productService } from "@/OLD/services/product.service";

import { EditTwoTone } from "@ant-design/icons";

import { Modal } from "antd";
import FormChild from "./FormChild";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { useToast } from "infinity-forge";

const Edit = memo(function Edit({ unitVariation, setReload }) {
  const [updateVisible, setUpdateVisible] = useState(false);
  const [data, setData] = useState({});
  const { createToast } = useToast();

  useEffect(() => {
    updateVisible &&
      setData({
        productVariationId: unitVariation?.product_variation_id,
        businessUnitId: unitVariation?.businness_unit_id,
        stock: unitVariation?.stock,
        maximumStock: unitVariation?.maximum_stock,
        minimumStock: unitVariation?.minimum_stock,
        costPrice: currencyFormatter(unitVariation?.cost_price),
        profitMargin: unitVariation?.profit_margin,
        price: currencyFormatter(unitVariation?.price),
        maximumDiscountPercentage: unitVariation?.maximum_discount_percentage,
        maximumDiscountValue: currencyFormatter(
          unitVariation?.maximum_discount_value
        ),
        metaType: unitVariation?.meta_type,
        commission: unitVariation?.commission,
        meta: unitVariation?.meta,
        commissionMeta: unitVariation?.commission_meta,
      });
  }, [updateVisible]);

  const submitUpdateService = useCallback(() => {
    let error = false;
    productService
      .updateBusinessUnitProduct(unitVariation?.id, {
        ...data,
        maximumDiscountValue: convertIntlCurrency(data?.maximumDiscountValue),
        price: convertIntlCurrency(data?.price),
        costPrice: convertIntlCurrency(data?.costPrice),
      })
      .then((res) =>
        createToast({
          message: "Serviço atualizado com sucesso!",
          status: "success",
        })
      )
      .catch((_err) => {
        error = true;
        createToast({
          message: "Houve um erro ao atualizar as informações do serviço",
          status: "error",
        });
      })
      .finally(() => {
        if (!error) {
          setUpdateVisible(false);
          setReload((prv) => !prv);
        }
      });
  }, [unitVariation?.id, data]);

  return (
    <div>
      <EditTwoTone onClick={() => setUpdateVisible(true)} />
      <Modal
        title="Atualizar informações do serviço"
        visible={updateVisible}
        onCancel={() => setUpdateVisible(false)}
        width={800}
        footer={null}
      >
        <FormChild
          data={data}
          setData={setData}
          setVisible={setUpdateVisible}
          submit={submitUpdateService}
        />
      </Modal>
    </div>
  );
});

export default Edit;
