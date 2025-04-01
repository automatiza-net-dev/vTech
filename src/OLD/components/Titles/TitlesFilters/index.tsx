import React, { useState, useEffect, useMemo } from "react";

import { useAuth } from "@/OLD/hooks/useAuth";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { accessControlTitles } from "@/OLD/utils/generalUtils";

import {
  api,
  Input,
  Button,
  Select,
  useQuery,
  FormHandler,
  useAuthAdmin,
  InputDateRange,
  InputDatePicker,
} from "infinity-forge";

import { Container } from "./styles";
import { useSystem } from "@/presentation";

export default function TitlesFilters({
  type,
  filters,
  setFilters,
  paymentMethods,
  plans,
  tutors,
  reload,
  suppliers,
  setReload,
  clinics,
  loadingFinances,
  setCreateTitleVisible,
}: any) {
  const [formatedTutors, setFormatedTutors] = useState<any[]>([]);
  const { setTitles } = useAuth();

  const clientOptions = useMemo(
    () =>
      formatedTutors?.map((tutor) => ({
        label: tutor?.name,
        value: tutor?.id,
      })),
    [formatedTutors]
  );

  const paymentMethodOptions = useMemo(
    () =>
      paymentMethods.map((method) => ({
        label: method.description,
        value: method.id,
      })),
    [paymentMethods]
  );

  const planOptions = useMemo(
    () =>
      plans.map((plan) => ({
        label: plan.description,
        value: plan.id,
      })),
    [plans]
  );

  useEffect(() => {
    const handleEnterKey = (e) => {
      if (e.key === "Enter" && !loadingFinances) {
        setReload((prev) => !prev);
        setTitles([]);
      }
    };

    document.addEventListener("keypress", handleEnterKey);
    return () => document.removeEventListener("keypress", handleEnterKey);
  }, [loadingFinances]);

  useEffect(() => {
    const formatClients = () => {
      const formattedTutors =
        tutors?.map((tutor) => ({
          ...tutor,
          value: tutor.name,
          key: tutor.id,
        })) || [];

      const formattedSuppliers = (suppliers || []).map((supplier) => ({
        ...supplier,
        value: supplier.name,
        key: supplier.id,
      }));

      const sortedClients = [...formattedTutors, ...formattedSuppliers].sort(
        (a, b) => a.value.localeCompare(b.value)
      );

      setFormatedTutors(sortedClients);
    };

    formatClients();
  }, [tutors, suppliers]);

  const tfeFlags = useQuery({
    queryKey: ["tfeFlags"],
    queryFn: async () => {
      const response = await api({
        method: "get",
        url: `payment-methods/tef-flags`,
        body: {
          type: "all",
        },
      });

      return response?.sort((a: any, b: any) => {
        if (a["description"]?.toLowerCase() < b["description"]?.toLowerCase()) {
          return -1;
        }

        if (a["description"]?.toLowerCase() > b["description"]?.toLowerCase()) {
          return 1;
        }

        return 0;
      });
    },
  });

  const { unit } = useSystem();

  const checkingAccounts = useQuery({
    queryKey: ["chekingAccounts"],
    queryFn: async () => {
      const response = await api({
        method: "get",
        url: `checking-accounts`,
        body: { unit: unit?.id },
      });

      return response;
    },
  });

  const createTitlePermission = useUserHasPermission(
    `${accessControlTitles(type)}01`
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          gap: 20,
          marginBottom: 20,
          marginTop: -50
        }}
      >
        {createTitlePermission && (
          <Button
            onClick={() => {
              setCreateTitleVisible(true);
            }}
            text="Novo título"
          />
        )}

        <Button
          onClick={() => {
            setFilters((prev) => ({ ...prev, noSearch: false }));
            setTitles([]);
            setReload(!reload);
          }}
          text="Filtrar"
        />
      </div>

      <hr />

      <Container>
        <FormHandler
          cleanFieldsOnSubmit={false}
          initialData={filters}
          onChangeForm={{
            callbackResult: (formValues) => {
              setFilters((prev) => ({
                ...prev,
                order: formValues.order,
                unit: formValues.unit,
                groupBorderos: formValues.groupBorderos,
                reconciled: formValues.reconciled,
                status: formValues.status,
                plan: formValues.plan,
                accept: formValues.accept,
                paymentMethod: formValues.paymentMethod,
                nsu: formValues.nsu,
                client: formValues.client,
                document: formValues.document,
                fiscalNote: formValues.fiscalNote,
                fromIssue: formValues.fromIssue,
                toIssue: formValues.toIssue,
                fromExpiration: formValues.fromExpiration,
                toExpiration: formValues.toExpiration,
                fromPayment: formValues.fromPayment,
                toPayment: formValues.toPayment,
                competence: formValues.competence,
              }));
            },
          }}
        >
          <div className="box">
            <InputDateRange
              id="Date"
              isClearable
              enableFilter
              placeholder="DD/MM/YYYY"
              label="Data emissão"
              names={["fromIssue", "toIssue"]}
            />

            <InputDateRange
              id="Date"
              isClearable
              enableFilter
              placeholder="DD/MM/YYYY"
              label="Data Vencimento"
              names={["fromExpiration", "toExpiration"]}
            />

            <InputDateRange
              id="Date"
              isClearable
              enableFilter
              placeholder="DD/MM/YYYY"
              label="Data Pagamento"
              names={["fromPayment", "toPayment"]}
            />
          </div>

          <div className="box">
            <InputDateRange
              id="DateAccept"
              isClearable
              enableFilter
              placeholder="DD/MM/YYYY"
              label="Data aceite"
              names={["fromAcceptDate ", "toAcceptDate"]}
            />

            <div className="row">
              <InputDatePicker
                id="Date"
                mode="month"
                placeholder="MM/YYYY"
                label="Data competência"
                name="competence"
              />

              <Input label="Nº Comprovante / NSU" name="nsu" />
            </div>

            <div className="box">
              <Input label="Documento" name="document" />
              <Input label="Nota Fiscal" name="fiscalNote" />
            </div>
          </div>

          <div className="box">
            <Select
              onlyOneValue
              label="Nome do Titular"
              name="client"
              options={clientOptions}
              isClearable
            />

            <Select
              onlyOneValue
              label="Forma de pagamento"
              name="paymentMethod"
              options={paymentMethodOptions}
              isClearable
            />

            <Select
              label="Bandeira Tef."
              name="flagDescription"
              onlyOneValue
              options={tfeFlags?.data?.map((item) => ({
                label: item?.description,
                value: item.id,
              }))}
              onChangeInput={(value) => {
                setFilters((prv) => {
                  console.log("ue", prv)
                  return ({ ...prv, tefFlagId: value })
                });
              }}
            />
          </div>

          <div className="box">
            <Select
              label="Conta corrente"
              name="contaCorrente"
              onlyOneValue
              options={checkingAccounts?.data?.map((item) => ({
                label: item?.description,
                value: item.id,
              }))}
              onChangeInput={(value) => {
                setFilters((prv) => {
                  console.log(prv,"????")
                  return ({ ...prv, checkingAccountId: value })
                });
              }}
            />

            <Select
              onlyOneValue
              label="Plano Contas"
              name="plan"
              options={planOptions}
              isClearable
            />

            <Select
              onlyOneValue
              options={[
                { label: "Sim", value: "sim" },
                { label: "Não", value: "false" },
              ]}
              name="groupBorderos"
              label="Agrupa títulos borderô"
            />
          </div>

          <div className="box">
            <div className="row">
              <Select
                label="Tipo título"
                onlyOneValue
                disabled
                name="type"
                options={[
                  { label: "Todos", value: "all" },
                  { label: "Crédito", value: "CREDITO" },
                  { label: "Débito", value: "DEBITO" },
                ]}
              />

              <Select
                name="status"
                label="Situação"
                onlyOneValue
                options={[
                  { label: "Todos", value: "all" },
                  { label: "Aberto", value: "ABERTO" },
                  { label: "Baixado", value: "BAIXADO" },
                ]}
              />
            </div>

            <div className="row">
              <Select
                onlyOneValue
                options={[
                  { label: "Todos", value: "all" },
                  { label: "Sim", value: "SIM" },
                  { label: "Não", value: "NAO" },
                ]}
                name="accept"
                label="Aceite"
              />

              <Select
                onlyOneValue
                options={[
                  { label: "Todos", value: "all" },
                  { label: "Sim", value: "true" },
                  { label: "Não", value: "false" },
                ]}
                name="reconciled"
                label="Conciliado"
              />
            </div>

            {/* <Select
      label="Filial"
      name="unit"
      options={clinicOptions}
      onlyOneValue
      isClearable
    /> */}

            <Select
              label="Ordenar por"
              name="order"
              onlyOneValue
              isClearable
              options={[
                { label: "Data Vencimento", value: "expiration_date" },
                { label: "Data Emissão", value: "issue_date" },
                { label: "Data Competência", value: "competence_date" },
                { label: "Data Pagamento", value: "payment_date" },
                { label: "Documento / Parcela", value: "doc" },
              ]}
            />
          </div>
        </FormHandler>
      </Container>
    </>
  );
}
