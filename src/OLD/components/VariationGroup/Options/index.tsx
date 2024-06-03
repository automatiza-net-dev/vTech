// @ts-nocheck
// Core
import { memo, useState } from "react";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";

// Services
import { variationGroupService } from "@/OLD/services/variation-group.service";
import { variationService } from "@/OLD/services/variation.service";

// Components
import { Button, List, Modal, Select } from "antd";
import { useMutation, useQuery } from "react-query";

const UpdateGroupVariations = memo(function UpdateGroupVariations({
  id,
  visible,
  hide,
}) {
  const [newVariation, setNewVariation] = useState(null);

  const { data, refetch } = useQuery(
    ["variation-group", id],
    () => variationGroupService.showVariationGroup(id),
    {
      enabled: !!id,
    }
  );

  const { data: variationsData } = useQuery(["variation"], () =>
    variationService.listVariations({})
  );

  const { mutate, isLoading } = useMutation(
    (newData) => variationGroupService.assignVariationToGroup(newData),
    {
      onSuccess: () => {
        refetch();
        setNewVariation(null);
      },
    }
  );

  const { mutate: mutateDeleteOption } = useMutation(
    (d: any) =>
      variationGroupService.detachVariationFromGroup(d.group, d.variation),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const submit = () => {
    if (!newVariation) return;

    mutate({
      variation_id: newVariation,
      group_variation_id: id,
    } as any);
  };

  return (
    <Modal
      title="Atualizar informações da variação"
      visible={visible}
      onCancel={hide}
      footer={null}
    >
      <List
        bordered
        dataSource={data?.variations}
        renderItem={(item) => (
          <List.Item
            actions={[
              <DeleteTwoTone
                twoToneColor={"red"}
                onClick={() =>
                  mutateDeleteOption({
                    group: id,
                    variation: item.id,
                  } as any)
                }
              />,
            ]}
          >
            {item.description}
          </List.Item>
        )}
      />

      <hr />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="uk-flex uk-flex-column uk-margin-top">
          <label>Adicionar variação</label>
          <Select onChange={(value) => setNewVariation(value)}>
            {variationsData
              ?.filter(
                (item) =>
                  !data?.variations?.some(
                    (variation) => variation.id === item.id
                  )
              )
              .map((item) => (
                <Select.Option value={item.id}>
                  {item.description}
                </Select.Option>
              ))}
          </Select>
        </div>

        <footer className="uk-flex uk-flex-right">
          <div className="uk-flex uk-flex-around uk-padding-small">
            <Button
              htmlType="submit"
              type="primary"
              className="uk-margin-right"
              disabled={isLoading}
            >
              Salvar
            </Button>
            <Button onClick={hide}>Cancelar</Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
});

export default UpdateGroupVariations;
