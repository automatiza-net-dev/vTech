import React, { memo, useState, useEffect, useMemo } from "react";

import { useAuth } from "@/OLD/hooks/useAuth";

import {
  Button,
  Select,
  Input,
  InputRadio,
  FormHandler,
  InputDateRange,
  InputDatePicker,
} from "infinity-forge";

import { Container } from "./styles";

const TitlesFilters = memo(function TitlesFilters({
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

  const clinicOptions = useMemo(
    () =>
      (clinics &&
        clinics?.map((clinic) => ({
          value: clinic.id,
          label: clinic.companyName,
        }))) ||
      [],
    [clinics]
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

  return (
    <Container>
      <FormHandler
        cleanFieldsOnSubmit={false}
        initialData={filters}
        onChangeForm={{
          callbackResult: (formValues) => {
            setFilters((prev) => ({
              ...prev,
              fromIssue: formValues.fromIssue,
              toIssue:formValues.toIssue,
              fromExpiration: formValues.fromExpiration,
              toExpiration: formValues.toExpiration,
              fromPayment:  formValues.fromPayment,
              toPayment: formValues.toPayment,
              competence: formValues.competence
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
          <InputDatePicker
            id="Date"
            mode="month"
            placeholder="MM/YYYY"
            label="Data competência"
            name="competence"
          />

          <div className="box">
            <Input label="Documento" name="document" />
            <Input label="Nota Fiscal" name="fiscalNote" />
          </div>

          <Input label="Nº Comprovante / NSU" name="nsu" />
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
            onlyOneValue
            label="Plano Contas"
            name="plan"
            options={planOptions}
            isClearable
          />
        </div>

        <div className="box">
          <InputRadio
            options={[
              { label: "Todos", value: "all" },
              { label: "Aberto", value: "ABERTO" },
              { label: "Baixado", value: "BAIXADO" },
            ]}
            name="status"
            label="Situação"
          />

          <InputRadio
            options={[
              { label: "Todos", value: "all" },
              { label: "Sim", value: "SIM" },
              { label: "Não", value: "NAO" },
            ]}
            name="accept"
            label="Aceite"
          />

          <InputRadio
            options={[
              { label: "Todos", value: "all" },
              { label: "Sim", value: "true" },
              { label: "Não", value: "false" },
            ]}
            name="reconciled"
            label="Conciliado"
          />

          <InputRadio
            options={[
              { label: "Sim", value: "sim" },
              { label: "Não", value: "false" },
            ]}
            name="groupBorderos"
            label="Agrupa títulos borderô"
          />
        </div>

        <div className="box">
          <Select
            label="Filial"
            name="unit"
            options={clinicOptions}
            onlyOneValue
            isClearable
          />

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

          <Button
            onClick={() => {
              setFilters((prev) => ({ ...prev, noSearch: false }));
              setTitles([]);
              setReload(!reload);
            }}
            text="Filtrar"
          />
        </div>
      </FormHandler>
    </Container>
  );
});

export default TitlesFilters;
