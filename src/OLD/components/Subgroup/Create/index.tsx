// Core
import { useCallback, useState } from "react";

// Services
import { subgroupsService } from "@/OLD/services/subgroups.service";

// Components
import { Button, Input, Select } from "antd";
import { useQueryClient, useToast } from "infinity-forge";
import { useMutation } from "infinity-forge";

import { Modal } from "infinity-forge";
import { AxiosError } from "axios";

const { TextArea } = Input;

export default function CreateSubgroup({ visible, hide, subgroups = [] }: {
  visible: boolean
  hide: () => void
  subgroups: { id: string, description: string, parent: string }[]
}) {
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const [data, setData] = useState<{
    description: string
    parent: string | null
  }>({ description: "", parent: null });

  const { mutate, isLoading } = useMutation({
    queryKey: ["CreateSubgroupmutation"],
    queryFn: (newData) => subgroupsService.storeSubgroup(newData),
    onSuccess: () => {
      createToast({
        message: "Exame cadastrado com sucesso!",
        status: "success",
      });

      queryClient.invalidateQueries(["subgroups"]);
      setData({ description: "", parent: null });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        createToast({
          message: error?.response?.data.errors[0].message,
          status: "error",
        });
      } else {
        createToast({
          message: 'Erro ao cadastrar Subgrupo',
          status: "error",
        });
      }
    },
  });

  const submitExam = useCallback(() => {
    mutate(data);
  }, [data]);

  return (
    <Modal open={visible} onClose={() => hide()}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitExam();

          hide();
        }}
      >
        <div className="uk-margin-top">
          <label>Descrição</label>
          <TextArea
            value={data?.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <div className="uk-margin-top">
          <span>Subgrupo Pai</span>
          <Select
            className="uk-width-1-1"
            value={
              subgroups.find((item) => item?.id === data?.parent)?.description
            }
            onChange={(e) => setData({ ...data, parent: e })}
            getPopupContainer={trigger => trigger.parentNode}
          >
            {subgroups
              .sort((a, b) => a.description.localeCompare(b.description))
              .map((item, i) => (
                <Select.Option key={i} value={item.id}>
                  {item?.description}
                </Select.Option>
              ))}
          </Select>
        </div>

        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Salvar
            </Button>
            <Button
              onClick={() => {
                setData({ description: "", parent: null });
                hide();
              }}
            >
              Cancelar
            </Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
