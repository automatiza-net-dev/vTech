// @ts-nocheck
import React, { memo, useState, useEffect, useCallback } from "react";

import { productService } from "@/OLD/services/product.service";

import { FiEdit2 } from "react-icons/fi";

import { Modal } from "antd";
import FormChild from "./FormChild";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import { useToast } from "infinity-forge";
import { AxiosError } from "axios";

const Edit = memo(function Edit({ unitVariation, setReload }) {
  const [updateVisible, setUpdateVisible] = useState(false);
  const [data, setData] = useState({});
  const { createToast } = useToast();
  const [errorsMap, setErrorsMap] = useState<Record<string, string>>({});

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
          unitVariation?.maximum_discount_value,
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
        }),
      )
      .catch((_err) => {
        console.error(_err);
        if (_err instanceof AxiosError) {
          const _data = _err.response?.data;
          if (Array.isArray(_data.errors)) {
            setErrorsMap(
              _data.errors.reduce((acc, curr) => {
                acc[curr.field] = curr.message;
                return acc;
              }, {}),
            );
          }
        }
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
  }, [unitVariation?.id, data, setErrorsMap]);

  return (
    <div>
      <FiEdit2
        onClick={() => setUpdateVisible(true)}
        style={{ cursor: "pointer", fontSize: "1.2rem" }}
      />
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
          errorsMap={errorsMap}
        />
      </Modal>
    </div>
  );
});

export default Edit;
