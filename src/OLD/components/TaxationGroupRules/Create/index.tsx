// @ts-nocheck
// Core
import * as crypto from "crypto";
import { memo, useCallback, useEffect, useState } from "react";

// Services
import { useLoadAllStates } from "@/presentation";
import { clinicService } from "@/OLD/services/clinic.service";
import { taxOperationService } from "@/OLD/services/tax-operation.service";
import { taxationGroupRulesService } from "@/OLD/services/taxation-group-rules.service";
import { taxationGroupsService } from "@/OLD/services/taxation-group.service";

// Components
import { Alert, Button, Input, InputNumber, Modal, Select } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BR_STATES } from "../data/br_states";
import { ICMS_CST_NAO_SIMPLES, ICMS_CST_SIMPLES } from "../data/icms_cst";
import { IPI_CST_ENTRADA, IPI_CST_SAIDA } from "../data/ipi_cst";
import {
  PIS_COFINS_CST_ENTRADA,
  PIS_COFINS_CST_SAIDA,
} from "../data/pis_cofins_cst";
import { useToast } from "infinity-forge";

function CreateTaxationGroupRule({ visible, hide }) {
  const queryClient = useQueryClient();
  const { createToast } = useToast();
  const [data, setData] = useState({});
  const [selectedState, setSelectedState] = useState(null);

  const states = useLoadAllStates();

  const { data: taxOperations } = useQuery(
    ["tax-operations"],
    () => taxOperationService.listTaxOperations({}),
    {
      enabled: visible,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: 1000 * 60,
      onSuccess: (reqData) => {
        if (reqData.length === 1) {
          setData((prev) => ({
            ...prev,
            taxOperationId: reqData[0].id,
          }));
        }
      },
    }
  );
  const { data: units } = useQuery(
    ["units"],
    () => clinicService.getClinicsByUser(),
    {
      enabled: visible,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: 1000 * 60,
    }
  );

  const { mutateAsync, isLoading } = useMutation(
    (newData) => taxationGroupRulesService.storeTaxationGroupRule(newData),
    {
      onSuccess: async () => {
        createToast({
          message: "Grupo cadastrado com sucesso!",
          status: "success",
        });
        await queryClient.invalidateQueries(["taxation-group-rules"]);
        // setData({})
        // hide()
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );
  const { mutateAsync: createGroup, error: createGroupError } = useMutation(
    (newData) => taxationGroupsService.storeTaxationGroup(newData),
    {}
  );

  useEffect(() => {
    if (!data?.companyType || !data?.icmsCst) {
      return;
    }

    const pool =
      data?.companyType === "SIMPLES" ? ICMS_CST_SIMPLES : ICMS_CST_NAO_SIMPLES;
    if (!pool.find((item) => item.value === data?.icmsCst)) {
      setData((prev) => ({ ...prev, icmsCst: null }));
    }
  }, [data?.companyType, data?.icmsCst]);

  const uniqueStates = Array.from(
    new Set(units?.data.map((unit) => unit.state))
  );

  useEffect(() => {
    for (const uState of uniqueStates) {
      const exists = data[uState];

      if (!exists) {
        setData((prev) => ({
          ...prev,
          [uState]: {
            fromUf: uState,
            toUf: uState,
            extras: {},
          },
        }));
      }
    }
  }, [uniqueStates, data]);

  const addState = () => {
    if (!selectedState) {
      return;
    }

    const key = crypto.randomBytes(4).toString("hex");
    const stateData = data[selectedState];
    const extras = stateData?.extras || {};
    extras[key] = {
      fromUf: selectedState,
      toUf: selectedState,
    };

    setData((prev) => ({
      ...prev,
      [selectedState]: {
        ...stateData,
        extras,
      },
    }));
  };

  const submit = useCallback(async () => {
    const taxationGroup = await createGroup({
      name: data?.taxationGroup,
    });

    uniqueStates.forEach(async (state) => {
      const partial = data[state];
      // Se possui apenas os campos fromUf, toUf e extras, não é necessário cadastrar
      if (Object.keys(partial).length === 3) {
        return;
      }

      const result = await mutateAsync({
        companyType: data.companyType,
        movementCategory: data.movementCategory,
        movementType: data.movementType,
        taxationGroupId: taxationGroup.id,
        ...partial,
      });

      const keys = Object.keys(partial.extras);
      for (const key of keys) {
        const extra = partial.extras[key];
        // Se possui apenas os campos fromUf, toUf, não é necessário cadastrar
        if (Object.keys(extra).length === 2) {
          continue;
        }

        const extraResult = await mutateAsync({
          companyType: data.companyType,
          movementCategory: data.movementCategory,
          movementType: data.movementType,
          taxationGroupId: taxationGroup.id,
          ...extra,
        });

        if (extraResult.id) {
          delete partial.extras[key];
        }
      }

      if (result.id) {
        setData((prev) => ({
          ...prev,
          [state]: {
            fromUf: state,
            toUf: state,
            extras: {},
          },
        }));
      }
    });
  }, [data]);

  const close = () => {
    setData({});
    setSelectedState(null);
    hide();
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={close}
      title="Cadastro de regra de grupo de impostos"
      width={1250}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await submit();
        }}
      >
        {createGroupError && (
          <Alert type="error" message={createGroupError.message} />
        )}

        <div className="uk-width-1-1">
          <label>Grupo de Tributação</label>
          <Input
            placeholder="Nome do Grupo de Tributação"
            value={data.taxationGroup}
            onChange={(e) =>
              setData({ ...data, taxationGroup: e.target.value })
            }
            style={{ width: "100%" }}
            required
          />
        </div>

        <div className="uk-flex" style={{ gap: "1rem" }}>
          <div className="uk-margin-top uk-width-1-1">
            <label>Tipo de Empresa</label>
            <Select
              placeholder="Selecione um tipo de empresa"
              value={data.companyType}
              onChange={(value) => setData({ ...data, companyType: value })}
              style={{ width: "100%" }}
              options={[
                { label: "Simples", value: "SIMPLES" },
                { label: "Não simples", value: "NAO_SIMPLES" },
              ]}
            />
          </div>

          <div className="uk-margin-top uk-width-1-1">
            <label>Tipo de Movimento</label>
            <Select
              placeholder="Selecione um tipo de movimento"
              value={data.movementType}
              onChange={(value) => setData({ ...data, movementType: value })}
              style={{ width: "100%" }}
              options={[
                { label: "Entrada", value: "ENTRADA" },
                { label: "Saída", value: "SAIDA" },
              ]}
            />
          </div>

          <div className="uk-margin-top uk-width-1-1">
            <label>Tipo de Categoria de Movimento</label>
            <Select
              placeholder="Selecione um tipo de categoria"
              value={data.movementCategory}
              onChange={(value) =>
                setData({ ...data, movementCategory: value })
              }
              style={{ width: "100%" }}
              options={
                Boolean(data?.movementType)
                  ? data.movementType === "ENTRADA"
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
                        { label: "Nota Saída (Venda)", value: "NOTA_SAIDA" },
                        { label: "Devolução Saída", value: "DEVOLUCAO_SAIDA" },
                        {
                          label: "Tranferência Saída",
                          value: "TRANSFERENCIA_SAIDA",
                        },
                        { label: "Outras Saídas", value: "OUTROS_SAIDAS" },
                      ]
                  : []
              }
            />
          </div>
        </div>

        <hr />

        <div className="uk-margin-top">
          <div className="uk-flex-col" style={{ gap: "0.75rem" }}>
            <label>Selecione o estado de origem da regra</label>
            <Select
              placeholder="Selecione um tipo de categoria"
              value={selectedState}
              onChange={(value) => setSelectedState(value)}
              style={{ width: "100%" }}
              options={states?.data?.map((state) => ({
                label: state,
                value: state,
              }))}
            />
          </div>

          {Boolean(selectedState) && (
            <>
              <div className="uk-margin-top">
                <label>Dentro do Estado</label>

                <div className="uk-flex uk-margin-top" style={{ gap: "1rem" }}>
                  <div className="uk-flex uk-flex-column uk-width-1-4">
                    <label>UF Origem</label>
                    <Select
                      value={selectedState}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            fromUf: value,
                          },
                        });
                      }}
                      options={[selectedState].map((_state) => ({
                        label: _state,
                        value: _state,
                      }))}
                    />
                  </div>

                  <div className="uk-flex uk-flex-column uk-width-1-4">
                    <label>UF Destino</label>
                    <Select
                      value={data[selectedState]?.toUf}
                      options={[selectedState].map((_state) => ({
                        label: _state,
                        value: _state,
                      }))}
                    />
                  </div>

                  <div className="uk-flex-column uk-width-1-1">
                    <label>Operação fiscal</label>
                    <Select
                      placeholder="Selecione uma Operação fiscal"
                      value={data[selectedState]?.taxOperationId}
                      onChange={(value) => {
                        setData((prev) => ({
                          ...prev,
                          [selectedState]: {
                            ...prev[selectedState],
                            taxOperationId: value,
                          },
                        }));
                      }}
                      style={{ width: "100%" }}
                      options={taxOperations
                        ?.filter((item) => {
                          if (!data?.movementType) {
                            return false;
                          }

                          if (data?.movementType === "ENTRADA") {
                            return item.code.startsWith("1");
                          }
                          if (data?.movementType === "SAIDA") {
                            return item.code.startsWith("5");
                          }

                          return false;
                        })
                        .map((item) => ({
                          label: [item.code, " - ", item.description].join(" "),
                          value: item.id,
                        }))}
                    />
                  </div>
                </div>

                <div
                  className="uk-margin-top uk-flex"
                  style={{ gap: "0.5rem" }}
                >
                  <div className="uk-flex uk-flex-column uk-width-1-1">
                    <label>Cst Icms</label>
                    <Select
                      value={data?.[selectedState]?.icmsCst}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            icmsCst: value,
                          },
                        });
                      }}
                      options={
                        Boolean(data?.companyType)
                          ? data?.companyType === "SIMPLES"
                            ? ICMS_CST_SIMPLES
                            : ICMS_CST_NAO_SIMPLES
                          : []
                      }
                      style={{ width: "790px" }}
                    />
                  </div>

                  <div className="uk-flex uk-flex-column uk-width-1-4">
                    <label>% Icms</label>
                    <InputNumber
                      value={data?.[selectedState]?.icmsPerc}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            icmsPerc: value,
                          },
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
                      ].includes(data?.[selectedState]?.icmsCst)}
                    />
                  </div>

                  <div className="uk-flex uk-flex-column uk-width-1-4">
                    <label>Cod. Benef. Fiscal</label>
                    <Input
                      value={data?.[selectedState]?.taxBenefitCode}
                      onChange={(e) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            taxBenefitCode: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>

                <div
                  className="uk-margin-top uk-flex"
                  style={{ gap: "0.5rem" }}
                >
                  <div className="uk-flex uk-flex-column uk-width-1-4">
                    <label>% Fcp</label>
                    <InputNumber
                      value={data?.[selectedState]?.fcpPerc}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            fcpPerc: value,
                          },
                        });
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className="uk-flex uk-flex-column uk-width-1-4">
                    <label>% Red. Aliq. Icms</label>
                    <InputNumber
                      value={data?.[selectedState]?.icmsPercRedAliquota}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            icmsPercRedAliquota: value,
                          },
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
                      ].includes(data?.[selectedState]?.icmsCst)}
                    />
                  </div>

                  <div className="uk-flex uk-flex-column uk-width-1-4">
                    <label>% Red. Base Calc. Icms</label>
                    <InputNumber
                      value={data?.[selectedState]?.icmsPercRedBaseCalculo}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            icmsPercRedBaseCalculo: value,
                          },
                        });
                      }}
                      style={{ width: "100%" }}
                      required={["20", "70"].includes(
                        data?.[selectedState]?.icmsCst
                      )}
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
                      ].includes(data?.[selectedState]?.icmsCst)}
                    />
                  </div>

                  <div className="uk-flex uk-flex-column uk-width-1-4">
                    <label>% Diferimento Icms</label>
                    <InputNumber
                      value={data?.[selectedState]?.icmsPercDiferimento}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            icmsPercDiferimento: value,
                          },
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
                      ].includes(data?.[selectedState]?.icmsCst)}
                    />
                  </div>
                </div>

                <div
                  className="uk-margin-top uk-flex"
                  style={{ gap: "0.5rem" }}
                >
                  <div className="uk-flex uk-flex-column uk-width-1-1">
                    <label>% Iva Icms ST</label>
                    <InputNumber
                      value={data?.[selectedState]?.ivaIcmsSt}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            ivaIcmsSt: value,
                          },
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
                      ].includes(data?.[selectedState]?.icmsCst)}
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
                      ].includes(data?.[selectedState]?.icmsCst)}
                    />
                  </div>

                  <div className="uk-flex uk-flex-column uk-width-1-1">
                    <label>% Red. B. C. Icms ST</label>
                    <InputNumber
                      value={data?.[selectedState]?.icmsPercRedBaseCalculoST}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            icmsPercRedBaseCalculoST: value,
                          },
                        });
                      }}
                      style={{ width: "100%" }}
                      required={["201", "202", "203"].includes(
                        data?.[selectedState]?.icmsCst
                      )}
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
                      ].includes(data?.[selectedState]?.icmsCst)}
                    />
                  </div>
                </div>

                <div
                  className="uk-margin-top uk-flex"
                  style={{ gap: "0.5rem" }}
                >
                  <div className="uk-flex uk-flex-column uk-width-1-1">
                    <label>Cst. Ipi</label>
                    <Select
                      value={data?.[selectedState]?.ipiCst}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            ipiCst: value,
                          },
                        });
                      }}
                      options={
                        Boolean(data?.movementType)
                          ? data.movementType === "ENTRADA"
                            ? IPI_CST_ENTRADA
                            : IPI_CST_SAIDA
                          : []
                      }
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className="uk-flex uk-flex-column uk-width-1-2">
                    <label>% Ipi</label>
                    <InputNumber
                      required
                      value={data?.[selectedState]?.ipiPerc}
                      onChange={(value) => {
                        const stateData = data[selectedState];

                        setData({
                          ...data,
                          [selectedState]: {
                            ...stateData,
                            ipiPerc: value,
                          },
                        });
                      }}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              <div className="uk-margin-top uk-flex" style={{ gap: "0.5rem" }}>
                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <label>Cst Pis</label>
                  <Select
                    value={data?.[selectedState]?.pisCst}
                    onChange={(value) => {
                      const stateData = data[selectedState];

                      setData({
                        ...data,
                        [selectedState]: {
                          ...stateData,
                          pisCst: value,
                        },
                      });
                    }}
                    options={
                      Boolean(data?.movementType)
                        ? data.movementType === "ENTRADA"
                          ? PIS_COFINS_CST_ENTRADA
                          : PIS_COFINS_CST_SAIDA
                        : []
                    }
                  />
                </div>

                <div className="uk-flex uk-flex-column uk-width-1-2">
                  <label>% Pis</label>
                  <InputNumber
                    required
                    value={data?.[selectedState]?.pisPerc}
                    onChange={(value) => {
                      const stateData = data[selectedState];

                      setData({
                        ...data,
                        [selectedState]: {
                          ...stateData,
                          pisPerc: value,
                        },
                      });
                    }}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div className="uk-margin-top uk-flex" style={{ gap: "0.5rem" }}>
                <div className="uk-flex uk-flex-column uk-width-1-1">
                  <label>Cst Cofins</label>
                  <Select
                    value={data?.[selectedState]?.cofinsCst}
                    onChange={(value) => {
                      const stateData = data[selectedState];

                      setData({
                        ...data,
                        [selectedState]: {
                          ...stateData,
                          cofinsCst: value,
                        },
                      });
                    }}
                    options={
                      Boolean(data?.movementType)
                        ? data.movementType === "ENTRADA"
                          ? PIS_COFINS_CST_ENTRADA
                          : PIS_COFINS_CST_SAIDA
                        : []
                    }
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="uk-flex uk-flex-column uk-width-1-2">
                  <label>% Cofins</label>
                  <InputNumber
                    required
                    value={data?.[selectedState]?.cofinsPerc}
                    onChange={(value) => {
                      const stateData = data[selectedState];

                      setData({
                        ...data,
                        [selectedState]: {
                          ...stateData,
                          cofinsPerc: value,
                        },
                      });
                    }}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <hr />

              <div
                className="uk-margin-top uk-flex uk-flex-between"
                style={{ gap: "0.5rem" }}
              >
                <label>Fora do Estado</label>
                <Button onClick={addState}>Adicionar</Button>
              </div>

              {/* {Object.keys(data?.[selectedState]?.extras).map((extra) => (
                <div className="uk-margin-top" key={extra}>
                  <div
                    className="uk-margin-top uk-flex"
                    style={{ gap: "0.5rem" }}
                  >
                    <div className="uk-flex uk-flex-column uk-width-1-4">
                      <label>UF Origem</label>
                      <Select
                        value={selectedState}
                        options={[selectedState].map((_state) => ({
                          label: _state,
                          value: _state,
                        }))}
                      />
                    </div>

                    <div className="uk-flex uk-flex-column uk-width-1-4">
                      <label>UF Destino</label>
                      <Select
                        value={data[selectedState]?.extras[extra].toUf}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["toUf"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        options={["TODOS", ...BR_STATES].map((_state) => ({
                          label: _state,
                          value: _state,
                        }))}
                      />
                    </div>

                    <div className="uk-flex-column uk-width-1-1">
                      <label>Operação fiscal</label>
                      <Select
                        placeholder="Selecione uma Operação fiscal"
                        value={
                          data[selectedState]?.extras[extra].taxOperationId
                        }
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["taxOperationId"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        style={{ width: "100%" }}
                        options={taxOperations
                          ?.filter((item) => {
                            if (!data?.movementType) {
                              return false;
                            }

                            if (data?.movementType === "ENTRADA") {
                              if (
                                data?.[selectedState]?.extras[extra]?.toUf ===
                                selectedState
                              ) {
                                return item.code.startsWith("1");
                              } else {
                                return item.code.startsWith("2");
                              }
                            }
                            if (data?.movementType === "SAIDA") {
                              if (
                                data?.[selectedState]?.extras[extra]?.toUf ===
                                selectedState
                              ) {
                                return item.code.startsWith("5");
                              } else {
                                return item.code.startsWith("6");
                              }
                            }

                            return false;
                          })
                          .map((item) => ({
                            label: [item.code, " - ", item.description].join(
                              " "
                            ),
                            value: item.id,
                          }))}
                      />
                    </div>
                  </div>

                  <div
                    className="uk-margin-top uk-flex"
                    style={{ gap: "0.5rem" }}
                  >
                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>Cst Icms</label>
                      <Select
                        value={data?.[selectedState]?.extras[extra]?.icmsCst}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["icmsCst"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        options={
                          Boolean(data?.companyType)
                            ? data?.companyType === "SIMPLES"
                              ? ICMS_CST_SIMPLES
                              : ICMS_CST_NAO_SIMPLES
                            : []
                        }
                        style={{ width: "790px" }}
                      />
                    </div>

                    <div className="uk-flex uk-flex-column uk-width-1-4">
                      <label>% Icms</label>
                      <InputNumber
                        value={data?.[selectedState]?.extras[extra]?.icmsPerc}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["icmsPerc"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
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
                        ].includes(data?.[selectedState].extras[extra]?.icmsCst)}
                      />
                    </div>

                    <div className="uk-flex uk-flex-column uk-width-1-4">
                      <label>Cod. Benef. Fiscal</label>
                      <Input
                        value={
                          data[selectedState]?.extras[extra]?.taxBenefitCode
                        }
                        onChange={(e) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["taxBenefitCode"] = e.target.value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="uk-margin-top uk-flex"
                    style={{ gap: "0.5rem" }}
                  >
                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>% Fcp</label>
                      <InputNumber
                        value={data?.[selectedState]?.extras[extra]?.fcpPerc}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["fcpPerc"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        style={{ width: "100%" }}
                      />
                    </div>

                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>% Red. Aliq. Icms</label>
                      <InputNumber
                        value={
                          data[selectedState]?.extras[extra]?.icmsPercRedAliquota
                        }
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["icmsPercRedAliquota"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
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
                        ].includes(data?.[selectedState].extras[extra]?.icmsCst)}
                      />
                    </div>

                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>% Red. Base Calc. Icms</label>
                      <InputNumber
                        value={
                          data[selectedState]?.extras[extra]
                            ?.icmsPercRedBaseCalculo
                        }
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["icmsPercRedBaseCalculo"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        style={{ width: "100%" }}
                        required={["20", "70"].includes(
                          data?.[selectedState]?.icmsCst
                        )}
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
                        ].includes(data?.[selectedState].extras[extra]?.icmsCst)}
                      />
                    </div>

                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>% Diferimento Icms</label>
                      <InputNumber
                        value={
                          data[selectedState]?.extras[extra]?.icmsPercDiferimento
                        }
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["icmsPercDiferimento"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
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
                        ].includes(data?.[selectedState].extras[extra]?.icmsCst)}
                      />
                    </div>
                  </div>

                  <div
                    className="uk-margin-top uk-flex"
                    style={{ gap: "0.5rem" }}
                  >
                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>% Iva Icms ST</label>
                      <InputNumber
                        value={data[selectedState]?.extras[extra]?.ivaIcmsSt}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["ivaIcmsSt"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
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
                        ].includes(data?.[selectedState].extras[extra]?.icmsCst)}
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
                        ].includes(data?.[selectedState].extras[extra]?.icmsCst)}
                      />
                    </div>

                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>% Red. B. C. Icms ST</label>
                      <InputNumber
                        value={
                          data[selectedState]?.extras[extra]
                            ?.icmsPercRedBaseCalculoST
                        }
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["icmsPercRedBaseCalculoST"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        style={{ width: "100%" }}
                        required={["201", "202", "203"].includes(
                          data?.[selectedState]?.icmsCst
                        )}
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
                        ].includes(data?.[selectedState].extras[extra]?.icmsCst)}
                      />
                    </div>
                  </div>

                  <div
                    className="uk-margin-top uk-flex"
                    style={{ gap: "0.5rem" }}
                  >
                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>Cst. Ipi</label>
                      <Select
                        value={data?.[selectedState]?.extras[extra]?.ipiCst}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["ipiCst"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
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
                        value={data?.[selectedState]?.extras[extra]?.ipiPerc}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["ipiPerc"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <div
                    className="uk-margin-top uk-flex"
                    style={{ gap: "0.5rem" }}
                  >
                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>Cst Pis</label>
                      <Select
                        value={data?.[selectedState]?.extras[extra]?.pisCst}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["pisCst"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        options={
                          data?.movementType === "ENTRADA"
                            ? PIS_COFINS_CST_ENTRADA
                            : PIS_COFINS_CST_SAIDA
                        }
                      />
                    </div>

                    <div className="uk-flex uk-flex-column uk-width-1-2">
                      <label>% Pis</label>
                      <InputNumber
                        required
                        value={data?.[selectedState]?.extras[extra]?.pisPerc}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["pisPerc"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <div
                    className="uk-margin-top uk-flex"
                    style={{ gap: "0.5rem" }}
                  >
                    <div className="uk-flex uk-flex-column uk-width-1-1">
                      <label>Cst Cofins</label>
                      <Select
                        value={data?.[selectedState]?.extras[extra]?.cofinsCst}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["cofinsCst"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        options={
                          data?.movementType === "ENTRADA"
                            ? PIS_COFINS_CST_ENTRADA
                            : PIS_COFINS_CST_SAIDA
                        }
                      />
                    </div>

                    <div className="uk-flex uk-flex-column uk-width-1-2">
                      <label>% Cofins</label>
                      <InputNumber
                        required
                        value={data?.[selectedState]?.extras[extra]?.cofinsPerc}
                        onChange={(value) => {
                          const stateData = data[selectedState];
                          const extraData = stateData.extras[extra];
                          extraData["cofinsPerc"] = value;

                          setData({
                            ...data,
                            [selectedState]: {
                              ...stateData,
                              extras: {
                                ...stateData.extras,
                                [extra]: extraData,
                              },
                            },
                          });
                        }}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <hr />
                </div>
              ))} */}
            </>
          )}
        </div>

        <hr />
        <footer className="uk-flex uk-flex-right">
          <div className="uk-width-1-2 uk-flex uk-flex-around">
            <Button htmlType="submit" type="primary" disabled={isLoading}>
              Salvar
            </Button>
            <Button onClick={close}>Cancelar</Button>
          </div>
        </footer>
      </form>
    </Modal>
  );
}

export default CreateTaxationGroupRule;
