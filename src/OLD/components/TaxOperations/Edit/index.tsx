import { useCallback, useEffect, useState } from "react";

import { taxOperationService } from "@/OLD/services/tax-operation.service";

import { Button, Input, Modal, Select } from "antd";
import { useMutation,  useQueryClient} from "@/presentation/use-query";

function UpdateTaxOperation({
  initialData,
  visible,
  hide,
}) {
  const queryClient = useQueryClient();

  const [data, setData] = useState<any>({
    code: "",
    description: "",
    movementType: null,
    movementCategory: null,
    generatesFinancial: false,
    accountingResult: false,
  });

  useEffect(() => {
    if (!initialData) return;

    setData({
      code: initialData.code,
      description: initialData.description,
      movementType: initialData.movement_type,
      movementCategory: initialData.movement_category,
      generatesFinancial: initialData.generatesFinancial === "Ativo",
      accountingResult: initialData.accountingResult === "Ativo",
      active: initialData.active === "Ativo",
    });
  }, [initialData]);

  const { mutate } = useMutation({
    queryKey: ["UpdateTaxOperationMutaton"],
    queryFn: (newData) =>
      taxOperationService.updateTaxOperations(initialData.id, newData),
    onSuccess: () => {
      queryClient.invalidateQueries(["tax-operations"]);
      hide();
    },
  });

  const submit = useCallback(() => {
    mutate(data);
  }, [data]);

  return (
    <Modal
      title="Atualizar informações do grupo de imposto"
      visible={visible}
      onCancel={hide}
      footer={null}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="uk-margin-top">
          <label>Código</label>
          <Input
            value={data?.code}
            onChange={(e) => setData({ ...data, code: e.target.value })}
          />
        </div>

        <div className="uk-margin-top">
          <label>Descrição</label>
          <Input
            value={data?.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>

        <div className="uk-margin-top uk-flex-column uk-width-1-1">
          <label>Tipo de Movimentação</label>
          <Select
            value={data?.movementType}
            onChange={(e) => setData({ ...data, movementType: e })}
            options={[
              { label: "Entrada", value: "ENTRADA" },
              { label: "Saída", value: "SAIDA" },
            ]}
            className="uk-width-1-1"
          />
        </div>

        <div className="uk-margin-top uk-flex-column uk-width-1-1">
          <label>Categoria de Movimentação</label>
          <Select
            value={data?.movementCategory}
            onChange={(e) => setData({ ...data, movementCategory: e })}
            options={[
              { label: "Nota de Entrada (Entrada)", value: "NOTA_ENTRADA" },
              {
                label: "Devolução de Entrada (Entrada)",
                value: "DEVOLUCAO_ENTRADA",
              },
              {
                label: "Transferência de Entrada (Entrada)",
                value: "TRANSFERENCIA_ENTRADA",
              },
              { label: "Outras Entradas (Entrada)", value: "OUTROS_ENTRADAS" },
              { label: "Nota de Saída (Saída)", value: "NOTA_SAIDA" },
              { label: "Devolução de Saída (Saída)", value: "DEVOLUCAO_SAIDA" },
              {
                label: "Transferência de Saída (Saída)",
                value: "TRANSFERENCIA_SAIDA",
              },
              { label: "Outras Saídas (Saída)", value: "OUTROS_SAIDAS" },
            ]}
            className="uk-width-1-1"
          />
        </div>

        <div className="uk-margin-top uk-flex-column uk-width-1-1">
          <label>Gera Financeiro</label>
          <Select
            value={data?.generatesFinancial}
            onChange={(e) => setData({ ...data, generatesFinancial: e })}
            options={[
              { label: "Sim", value: true },
              { label: "Não", value: false },
            ]}
            className="uk-width-1-1"
          />
        </div>

        <div className="uk-margin-top uk-flex-column uk-width-1-1">
          <label>Apura Resultado</label>
          <Select
            value={data?.accountingResult}
            onChange={(e) => setData({ ...data, accountingResult: e })}
            options={[
              { label: "Sim", value: true },
              { label: "Não", value: false },
            ]}
            className="uk-width-1-1"
          />
        </div>

        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary">
              Salvar
            </Button>
            <Button
              onClick={() => {
                setData({
                  code: "",
                  description: "",
                  movementType: null,
                  movementCategory: null,
                  generatesFinancial: false,
                  accountingResult: false,
                });

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

export default UpdateTaxOperation;
