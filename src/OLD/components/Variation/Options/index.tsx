// @ts-nocheck
// Core
import { memo, useCallback, useState } from "react";

// Icons
import { DeleteTwoTone } from "@ant-design/icons";

// Services
import { variationService } from "@/OLD/services/variation.service";

// Components
import { Button, List, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useMutation, useQuery } from "react-query";

const UpdateVariationOptions = memo(function UpdateVariationOptions({
  id,
  visible,
  hide,
}) {
  const [optionData, setOptionData] = useState({
    description: "",
  });

  const { data, refetch } = useQuery(["variation", id], () =>
    variationService.showVariation(id)
  );

  const { mutate: mutateOption, isLoading } = useMutation(
    (newData) => variationService.storeVariationOption(newData),
    {
      onSuccess: () => {
        refetch();
        setOptionData({ description: "" });
      },
    }
  );

  const { mutate: mutateDeleteOption } = useMutation(
    (id) => variationService.deleteVariationOption(id),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  // const { mutate, isLoading } = useMutation(
  //   (newData) => variationService.updateVariation(variationInfo.id, newData),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(['variations'])
  //       hide()
  //     }
  //   }
  // )

  const submit = useCallback(() => {
    mutateOption({
      description: optionData.description,
      variationId: id,
    });
  }, [optionData]);

  return (
    <Modal
      title="Atualizar informações da variação"
      visible={visible}
      onCancel={hide}
      footer={null}
    >
      <List
        bordered
        dataSource={data?.options}
        renderItem={(item) => (
          <List.Item
            actions={[
              <DeleteTwoTone
                twoToneColor={"red"}
                onClick={() => mutateDeleteOption(item.id)}
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
        <div className="uk-margin-top">
          <label>Descrição</label>
          <TextArea
            value={optionData?.description}
            onChange={(e) =>
              setOptionData({ ...optionData, description: e.target.value })
            }
          />
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

export default UpdateVariationOptions;
