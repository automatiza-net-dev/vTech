// @ts-nocheck
// Core
import { memo, useCallback, useState } from "react";

// Services
import { taxOperationService } from "@/OLD/services/tax-operation.service";
import { taxationGroupRulesService } from "@/OLD/services/taxation-group-rules.service";
import { taxationGroupsService } from "@/OLD/services/taxation-group.service";

// Components
import { Button, Input, InputNumber, Modal, Select } from "antd";
import { useMutation, useQuery } from "@/presentation/use-query";
import { useQueryClient } from "@/presentation/use-query";
import { ICMS_CST_NAO_SIMPLES, ICMS_CST_SIMPLES } from "../data/icms_cst";
import { IPI_CST_ENTRADA, IPI_CST_SAIDA } from "../data/ipi_cst";
import {
  PIS_COFINS_CST_ENTRADA,
  PIS_COFINS_CST_SAIDA,
} from "../data/pis_cofins_cst";

const { TextArea } = Input;
const { Option } = Select;

const UpdateTaxationGroupRule = memo(function UpdateTaxationGroupRule({
  initialData,
  visible,
  hide,
}) {
  const queryClient = useQueryClient();

  const [data, setData] = useState(null);

  const { data: ruleData } = useQuery({
    queryKey: ["taxation-group-rule", initialData?.id],
    queryFn: () =>
      taxationGroupRulesService.showTaxationGroupRule(initialData.id),
    enabled: visible,
    
    onSuccess: (_data) => {
      setData({
        companyType: _data.company_type,
        movementType: _data.movement_type,
        movementCategory: _data.movement_category,
        fromUf: _data.from_uf,
        toUf: _data.to_uf,
        icmsCst: _data.icms_cst,
        icmsPerc: _data.icms_perc,
        icmsPercRedAliquota: _data.icms_perc_red_aliquota,
        icmsPercRedBaseCalculo: _data.icms_perc_red_base_calculo,
        ivaIcmsSt: _data.iva_icms_st,
        fcpPerc: _data.fcp_perc,
        taxBenefitCode: _data.tax_benefit_code,
        ipiCst: _data.ipi_cst,
        ipiPerc: _data.ipi_perc,
        pisCst: _data.pis_cst,
        pisPerc: _data.pis_perc,
        cofinsCst: _data.cofins_cst,
        cofinsPerc: _data.cofins_perc,
        icmsPercRedBaseCalculoST: _data.icms_perc_red_base_calculo_st,
        icmsPercDiferimento: _data.icms_perc_diferimento,
        taxationGroupId: _data.taxationGroup.id,
        taxationGroupName: _data.taxationGroup.name,
        taxOperationId: _data.taxOperation.id,
        active: _data.active,
      });
    },
  });

  const { data: taxOperations } = useQuery({
    queryKey: ["tax-operations"],
    queryFn: async () => taxOperationService.listTaxOperations({}),
    onSuccess: (reqData) => {
      if (reqData.length === 1) {
        setData((prev) => ({
          ...prev,
          taxOperationId: reqData[0].id,
        }));
      }
    },
    enabled: visible,
  });

  const { mutate, isLoading } = useMutation({
    queryKey: ["UpdateMutaitonasjas"],
    queryFn: (newData) =>
      taxationGroupRulesService.updateTaxationGroupRule(
        initialData.id,
        newData
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["taxation-group-rules"]);
      hide();
    },
  });

  const { mutateAsync: updateTaxationGroup } = useMutation({
    queryKey: ["Muraruarura"],
    queryFn: (newData) =>
      taxationGroupsService.updateTaxationGroup(
        ruleData.taxationGroup.id,
        newData
      ),
  });

  const submit = useCallback(async () => {
    if (data.taxationGroupName !== ruleData.taxationGroup.name) {
      await updateTaxationGroup({
        name: data.taxationGroupName,
        active: true,
      });
    }

    mutate(data);
  }, [data]);

  return (
    <Modal
      title="Atualizar informações de regra"
      visible={visible}
      onCancel={hide}
      footer={null}
      width={750}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div
          className="uk-flex uk-width-1-1 uk-margin-top "
          style={{ gap: "0.5em" }}
        >
          <div className="uk-flex uk-flex-column uk-width-1-1">
            <label>Grupo de Tributação</label>
            <Input
              readonly
              value={data?.taxationGroupName}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  taxationGroupName: e.target.value,
                }));
              }}
              style={{ width: "100%" }}
            />
          </div>

          <div className="uk-width-1-4">
            <label>Status</label>
            <Select
              placeholder="Status"
              value={data?.active}
              onChange={(value) => setData({ ...data, active: value })}
              style={{ width: "100%" }}
              options={[
                { label: "Ativo", value: true },
                { label: "Não ativo", value: false },
              ]}
            />
          </div>
        </div>

        <div
          className="uk-flex uk-width-1-1 uk-margin-top "
          style={{ gap: "0.5em" }}
        >
          <div className="uk-width-1-2">
            <label>Tipo de Empresa</label>
            <Select
              placeholder="Selecione um tipo de empresa"
              value={data?.companyType}
              onChange={(value) => setData({ ...data, companyType: value })}
              style={{ width: "100%" }}
              options={[
                { label: "Simples", value: "SIMPLES" },
                { label: "Não simples", value: "NAO_SIMPLES" },
              ]}
            />
          </div>

          <div className="uk-width-1-2">
            <label>Tipo de Movimento</label>
            <Select
              placeholder="Selecione um tipo de movimento"
              value={data?.movementType}
              onChange={(value) => setData({ ...data, movementType: value })}
              style={{ width: "100%" }}
              options={[
                { label: "Entrada", value: "ENTRADA" },
                { label: "Saída", value: "SAIDA" },
              ]}
            />
          </div>

          <div className="uk-width-1-1">
            <label>Categoria de Movimento</label>
            <Select
              placeholder="Selecione uma categoria"
              value={data?.movementCategory}
              onChange={(value) =>
                setData({ ...data, movementCategory: value })
              }
              style={{ width: "100%" }}
              options={
                data?.movementType === "ENTRADA"
                  ? [
                      { label: "Nota de Entrada", value: "NOTA_ENTRADA" },
                      {
                        label: "Devolução de entrada",
                        value: "DEVOLUCAO_ENTRADA",
                      },
                      {
                        label: "Tranferência de Entrada",
                        value: "TRANSFERENCIA_ENTRADA",
                      },
                      { label: "Outras Entradas", value: "OUTROS_ENTRADAS" },
                    ]
                  : [
                      { label: "Nota Saída", value: "NOTA_SAIDA" },
                      { label: "Devolução Saída", value: "DEVOLUCAO_SAIDA" },
                      {
                        label: "Tranferência Saída",
                        value: "TRANSFERENCIA_SAIDA",
                      },
                      { label: "Outras Saídas", value: "OUTROS_SAIDAS" },
                    ]
              }
            />
          </div>
        </div>

        <div
          className="uk-flex uk-width-1-1 uk-margin-top"
          style={{ gap: "0.5em" }}
        >
          <div className="uk-flex uk-flex-column uk-width-1-2">
            <label>Origem</label>
            <Input readonly value={data?.fromUf} style={{ width: "100%" }} />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-2">
            <label>Destino</label>
            <Input readonly value={data?.toUf} style={{ width: "100%" }} />
          </div>
        </div>

        <div className="uk-flex-column uk-margin-top uk-width-1-1">
          <label>Operação fiscal</label>
          <Select
            placeholder="Selecione uma Operação fiscal"
            value={data?.taxOperationId}
            onChange={(value) => {
              setData((prev) => ({
                ...prev,
                taxOperationId: value,
              }));
            }}
            style={{ width: "100%" }}
            options={taxOperations
              ?.filter((item) => {
                if (!data?.movementType) {
                  return false;
                }

                if (data?.movementType === "ENTRADA") {
                  if (data?.fromUf === data?.toUf) {
                    return item.code.startsWith("1");
                  }

                  return item.code.startsWith("2");
                }

                if (data?.movementType === "SAIDA") {
                  if (data?.fromUf === data?.toUf) {
                    return item.code.startsWith("5");
                  }

                  return item.code.startsWith("6");
                }

                return false;
              })
              .map((item) => ({
                label: [item.code, " - ", item.description].join(" "),
                value: item.id,
              }))}
          />
        </div>

        <div
          className="uk-flex uk-width-1-1 uk-margin-top"
          style={{ gap: "0.5em" }}
        >
          <div className="uk-flex uk-flex-column uk-width-1-1">
            <label>Cst Icms</label>
            <Select
              value={data?.icmsCst}
              onChange={(value) => {
                setData({
                  ...data,
                  icmsCst: value,
                });
              }}
              options={
                data?.companyType === "SIMPLES"
                  ? ICMS_CST_SIMPLES
                  : ICMS_CST_NAO_SIMPLES
              }
              style={{ width: "393px" }}
            />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-4">
            <label>% Icms</label>
            <InputNumber
              value={data?.icmsPerc}
              onChange={(value) => {
                setData({
                  ...data,
                  icmsPerc: value,
                });
              }}
              style={{ width: "100%" }}
              required={[
                "00",
                "10",
                "20",
                "30",
                "40",
                "41",
                "50",
                "51",
                "60",
                "70",
                "90",
                "102",
                "102",
                "103",
                "300",
                "400",
                "500",
                "201",
                "202",
                "203",
                "900",
              ].includes(data?.icmsCst)}
            />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-2">
            <label>Cod. Benef. Fiscal</label>
            <Input
              value={data?.taxBenefitCode}
              onChange={(e) => {
                setData({
                  ...data,
                  taxBenefitCode: e.target.value,
                });
              }}
            />
          </div>
        </div>

        <div className="uk-flex uk-margin-top" style={{ gap: "0.5rem" }}>
          <div className="uk-flex uk-flex-column uk-width-1-4">
            <label>% Fcp</label>
            <InputNumber
              value={data?.fcpPerc}
              onChange={(value) => {
                setData({
                  ...data,
                  fcpPerc: value,
                });
              }}
              style={{ width: "100%" }}
            />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-4">
            <label>% Red. Aliq. Icms</label>
            <InputNumber
              value={data?.icmsPercRedAliquota}
              onChange={(value) => {
                setData({
                  ...data,
                  icmsPercRedAliquota: value,
                });
              }}
              style={{ width: "100%" }}
              disabled={[
                "101",
                "102",
                "103",
                "300",
                "400",
                "500",
                "201",
                "202",
                "203",
                "900",
                "00",
                "10",
                "20",
                "30",
                "40",
                "41",
                "50",
                "51",
                "60",
                "70",
                "90",
              ].includes(data?.icmsCst)}
            />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-4">
            <label>% Red. Base Calc. Icms</label>
            <InputNumber
              value={data?.icmsPercRedBaseCalculo}
              onChange={(value) => {
                setData({
                  ...data,
                  icmsPercRedBaseCalculo: value,
                });
              }}
              style={{ width: "100%" }}
              required={["20", "70"].includes(data?.icmsCst)}
              disabled={[
                "101",
                "102",
                "103",
                "300",
                "400",
                "500",
                "201",
                "202",
                "203",
                "00",
                "10",
                "30",
                "40",
                "41",
                "50",
                "60",
              ].includes(data?.icmsCst)}
            />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-4">
            <label>% Diferimento Icms</label>
            <InputNumber
              value={data?.icmsPercDiferimento}
              onChange={(value) => {
                setData({
                  ...data,
                  icmsPercDiferimento: value,
                });
              }}
              style={{ width: "100%" }}
              disabled={[
                "101",
                "102",
                "103",
                "300",
                "400",
                "500",
                "201",
                "202",
                "203",
                "900",
                "00",
                "10",
                "20",
                "30",
                "40",
                "41",
                "50",
                "60",
                "70",
                "90",
              ].includes(data?.icmsCst)}
            />
          </div>
        </div>

        <div className="uk-flex uk-margin-top" style={{ gap: "0.5rem" }}>
          <div className="uk-flex uk-flex-column uk-width-1-4">
            <label>% Iva Icms ST</label>
            <InputNumber
              value={data?.ivaIcmsSt}
              onChange={(value) => {
                setData({
                  ...data,
                  ivaIcmsSt: value,
                });
              }}
              style={{ width: "100%" }}
              required={[
                "10",
                "30",
                "201",
                "202",
                "203",
                "900",
                "70",
                "90",
              ].includes(data?.icmsCst)}
              disabled={[
                "101",
                "102",
                "103",
                "300",
                "400",
                "500",
                "00",
                "20",
                "40",
                "41",
                "50",
                "51",
                "60",
              ].includes(data?.icmsCst)}
            />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-4">
            <label>% Red. B. C. Icms ST</label>
            <InputNumber
              value={data?.icmsPercRedBaseCalculoST}
              onChange={(value) => {
                setData({
                  ...data,
                  icmsPercRedBaseCalculoST: value,
                });
              }}
              style={{ width: "100%" }}
              required={["201", "202", "203"].includes(data?.icmsCst)}
              disabled={[
                "101",
                "102",
                "103",
                "300",
                "400",
                "500",
                "00",
                "20",
                "40",
                "41",
                "50",
                "51",
                "60",
              ].includes(data?.icmsCst)}
            />
          </div>
        </div>

        <div className="uk-flex uk-margin-top" style={{ gap: "0.5rem" }}>
          <div className="uk-flex uk-flex-column uk-width-1-1">
            <label>Cst. Ipi</label>
            <Select
              value={data?.ipiCst}
              onChange={(value) => {
                setData({
                  ...data,
                  ipiCst: value,
                });
              }}
              options={
                data?.movementType === "ENTRADA"
                  ? IPI_CST_ENTRADA
                  : IPI_CST_SAIDA
              }
              style={{ width: "100%" }}
            />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-2">
            <label>% Ipi</label>
            <InputNumber
              required
              value={data?.ipiPerc}
              onChange={(value) => {
                setData({
                  ...data,
                  ipiPerc: value,
                });
              }}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="uk-flex uk-margin-top" style={{ gap: "0.5rem" }}>
          <div className="uk-flex uk-flex-column uk-width-1-1">
            <label>Cst Pis</label>
            <Select
              value={data?.pisCst}
              onChange={(value) => {
                setData({
                  ...data,
                  pisCst: value,
                });
              }}
              options={
                data?.movementType === "ENTRADA"
                  ? PIS_COFINS_CST_ENTRADA
                  : PIS_COFINS_CST_SAIDA
              }
              style={{ width: "462px" }}
            />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-2">
            <label>% Pis</label>
            <InputNumber
              required
              value={data?.pisPerc}
              onChange={(value) => {
                setData({
                  ...data,
                  pisPerc: value,
                });
              }}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="uk-flex uk-margin-top" style={{ gap: "0.5rem" }}>
          <div className="uk-flex uk-flex-column uk-width-1-1">
            <label>Cst Cofins</label>
            <Select
              value={data?.cofinsCst}
              onChange={(value) => {
                setData({
                  ...data,
                  cofinsCst: value,
                });
              }}
              options={
                data?.movementType === "ENTRADA"
                  ? PIS_COFINS_CST_ENTRADA
                  : PIS_COFINS_CST_SAIDA
              }
              style={{ width: "462px" }}
            />
          </div>

          <div className="uk-flex uk-flex-column uk-width-1-2">
            <label>% Cofins</label>
            <InputNumber
              required
              value={data?.cofinsPerc}
              onChange={(value) => {
                setData({
                  ...data,
                  cofinsPerc: value,
                });
              }}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Salvar
            </Button>
            <Button onClick={hide}> Cancelar </Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
});

export default UpdateTaxationGroupRule;
