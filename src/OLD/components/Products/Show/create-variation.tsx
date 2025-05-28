// @ts-nocheck
// Core
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@/presentation/use-query";

// Services
import { productVariationsService } from "@/OLD/services/product-variations.service";
import { variationGroupService } from "@/OLD/services/variation-group.service";

// Components
import { Button, Input, Modal, Select } from "antd";

const CreateProductVariation = function CreateProductVariation({
  visible,
  initialData,
  close,
}) {
  const [data, setData] = useState({});

  const { data: variationGroupsData } = useQuery({
    queryKey: ["variation-groups"],
    queryFn: () => variationGroupService.listVariationGroups(),
    enabled: !!initialData.variationGroupId,
  });

  const handleClose = () => {
    setData(() => ({
      productId: "",
      barcode: "",
      options: [],
    }));

    close();
  };

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setData(() => ({
      productId: initialData.productId,
      barcode: "",
      options: [],
    }));
  }, [initialData]);

  const { isLoading, mutate } = useMutation({
    queryKey: ["CreateProductVariation"],
    queryFn: (newData) =>
      productVariationsService.createProductVariation(newData),
    onSuccess: () => {
      handleClose();
    },
  });

  const submit = useCallback(() => {
    const options = data.options.filter(Boolean);
    mutate({ ...data, options });
  }, [data]);

  return (
    <Modal
      title="Criar variação de produto"
      visible={visible}
      onCancel={handleClose}
      footer={null}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="uk-margin-top">
          <div className="uk-flex uk-flex-column">
            <div className="uk-width-1-1">
              <label>Código de barras</label>
              <Input
                maxLength={15}
                value={data.barcode}
                onChange={(e) => {
                  setData({ ...data, barcode: e.target.value });
                }}
              />
            </div>

            {variationGroupsData
              ?.find((v) => v.id === initialData.variationGroupId)
              ?.variations?.map((variation, index) => (
                <div className="uk-margin-top uk-width-1-1" key={index}>
                  <label>{variation.description}</label>
                  <Select
                    className="uk-width-1-1"
                    required
                    onChange={(value) => {
                      const options = data.options;
                      options[index] = value;
                      setData({ ...data, options });
                    }}
                  >
                    {variation.options.map((option) => (
                      <Select.Option
                        key={`variation-option-${option.id}`}
                        value={option.id}
                      >
                        {option.description}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              ))}
          </div>
        </div>

        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Salvar
            </Button>
            <Button onClick={handleClose}> Cancelar </Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
};

export default CreateProductVariation;
