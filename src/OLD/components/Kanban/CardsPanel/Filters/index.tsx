// @ts-nocheck
import { memo, useState, useEffect } from "react";

import { useConfigurationsSystem, useMe } from "@/presentation";
import { usePatients } from "@/OLD/hooks/usePatients";
// import { useTutor } from "@/OLD/hooks/useTutor";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useProfile } from "@/OLD/hooks/useProfile";

import { Checkbox, AutoComplete, Select, Input } from "antd";
import { Button, Icon, Tooltip, useAuthAdmin } from "infinity-forge";
import { DatePicker } from "@mui/x-date-pickers";
import { InputBox } from "./styles";
const { Option } = Select;

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

import { MdOutlineClear } from "react-icons/md";

function Filters({ filters, setFilters, setReload }) {
  const [values, setValues] = useState({});

    const {type} = useConfigurationsSystem()

  const { patients } = usePatients(
    false,
    false,
    type === "clinicas"
  );
  const { colaborators } = useColaborators();
  const { businessUnits } = useBusinessUnitsByUser(false);

  const viewAllOpportunitiesPermission = useUserHasPermission("CRM09");

  useEffect(() => {
    if (!viewAllOpportunitiesPermission) {
      setFilters({ ...filters, technician: user?.id, noSearch: false });
      setReload((prv) => !prv);
    } else {
      setFilters({ ...filters, noSearch: false });
      setReload((prv) => !prv);
    }
  }, [viewAllOpportunitiesPermission]);

  // sortItems(tutors, "name");
  sortItems(patients, "name");
  sortItems(colaborators, "name");
  sortItems(businessUnits, "fantasyName");

  return (
    <section style={{ display: "flex", gap: "10px" }}>
      <div className="uk-margin-right uk-width-1-4">
        <label>Cliente</label>
        <InputBox>
          <Input
            value={filters?.contactName}
            onChange={(e) =>
              setFilters((prv) => ({ ...prv, contactName: e.target.value }))
            }
          />
        </InputBox>

        <label>Dt Interação:&nbsp;</label>
        <InputBox className="uk-width-1-1 uk-margin-small-top">
          <DatePicker
            style={{ fontSize: "14px" }}
            className="custom-datepicker"
            key="dateFrom"
            format={"DD/MM/YYYY"}
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.dateFrom}
            onChange={(val) =>
              setFilters((prv) => ({
                ...prv,
                dateFrom: val,
              }))
            }
          />
          &nbsp;à&nbsp;
          <DatePicker
            key="dateTo"
            className="uk-margin-right custom-datepicker"
            format={"DD/MM/YYYY"}
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.dateTo}
            onChange={(val) =>
              setFilters((prv) => ({
                ...filters,
                dateTo: val,
              }))
            }
          />
          <MdOutlineClear
            size={40}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setFilters((prv) => ({
                ...prv,
                dateFrom: null,
                dateTo: null,
              }));
            }}
          />
          <Tooltip
            idTooltip="asq341"
            position="top-center"
            enableHover
            content={
              <>
                Esta consulta retorna todas as oportunidades que :
                <li>Tem a Data de Abertura no Periodo Selecionado</li>
                <li>Tem a Data de Contato no Periodo Selecionado</li>
                <li>Estão Agendadas para o Periodo Selecionado</li>
                <li>
                  Foi feito o seu Agendamento dentro do Periodo Selecionado;
                </li>
                <li>Compareceram na Data dentro no Periodo Selecionado;</li>
              </>
            }
            trigger={<Icon name="IconInfo" style={{ cursor: "pointer" }} />}
          />
        </InputBox>
      </div>

      <div className="uk-width-1-4 uk-margin-left">
        {type === "Vet" && (
          <>
            <label>Paciente</label>
            <InputBox className="">
              <Input
                value={filters?.patientName}
                onChange={(e) =>
                  setFilters((prv) => ({ ...prv, patientName: e.target.value }))
                }
              />
            </InputBox>
          </>
        )}
        <label>Ordenar por:</label>
        <InputBox className="uk-margin-small-top">
          <Select
            placeholder="Ordenar Por"
            className="uk-width-1-1"
            onChange={(val) => {
              setFilters((prv) => ({ ...prv, orderBy: val }));
              return setReload((prv) => !prv);
            }}
          >
            <Option value="contactDate">Data Contato</Option>
            <Option value="openingDate">Data Abertura</Option>
            <Option value="contact">Nome cliente</Option>
            {type === "Vet" && (
              <Option value="client">Paciente</Option>
            )}
          </Select>
        </InputBox>
        <div className="uk-margin-small-top">
          {/*
          <div>
            <Checkbox
              checked={filters?.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.checked })
              }
            />
            &nbsp; Ativo
          </div>
        */}
        </div>

      </div>

      <div className="uk-width-1-4 uk-margin-right">
        <label>Titulo Oportunidade</label>

        <InputBox>
          <Input
            className="uk-width-1-1"
            value={filters?.description}
            placeholder="Titulo Oportunidade"
            onChange={(e) =>
              setFilters((prv) => ({ ...prv, description: e.target.value }))
            }
          />
        </InputBox>

        <label>Dt Abertura:&nbsp;</label>
        <InputBox className="uk-width-1-1 uk-margin-small-top">
          <DatePicker
            format={"DD/MM/YYYY"}
            className="custom-datepicker"
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.openingFrom}
            onChange={(val) =>
              setFilters((prv) => ({
                ...prv,
                openingFrom: val,
              }))
            }
          />
          &nbsp;à&nbsp;
          <DatePicker
            className="uk-margin-right custom-datepicker"
            format={"DD/MM/YYYY"}
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.openingTo}
            onChange={(val) =>
              setFilters((prv) => ({
                ...prv,
                openingTo: val,
              }))
            }
          />
          <MdOutlineClear
            size={40}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setFilters((prv) => ({
                ...prv,
                openingFrom: null,
                openingTo: null,
              }));
            }}
          />
          <Tooltip
            trigger={<Icon name="IconInfo" />}
            content={
              <>
                Esta consulta retorna as oportunidades que foram cadastradas no{" "}
                <br />
                Periodo Selecionado, ou seja, esta é a Data de Lançamento da{" "}
                <br />
                oportunidade no Crm
              </>
            }
          />
        </InputBox>
      </div>

      <div className="uk-width-1-4 uk-margin-right">
        {viewAllOpportunitiesPermission && (
          <>
            <label>Prof. resp.</label>
            <InputBox className="">
              <AutoComplete
                allowClear
                onClear={() => {
                  const newObj = { ...filters };
                  delete newObj?.technician;
                  setFilters(newObj);
                }}
                className="uk-width-1-1"
                placeholder="Prof. resp."
                value={values?.techName}
                options={colaborators?.map((colab) => ({
                  ...colab,
                  value: colab?.name,
                  key: colab?.id,
                }))}
                onChange={(val) => {
                  const newObj = { ...filters };
                  setValues({ ...values, techName: val });
                  delete newObj?.technician;
                  setFilters(newObj);
                }}
                onSelect={(_val, opt) => {
                  setValues({ ...values, techName: opt?.value });
                  setFilters((prv) => ({ ...prv, technician: opt?.id }));
                  return setReload((prv) => !prv);
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val.toUpperCase())
                  )
                }
              />
            </InputBox>
          </>
        )}

        <label>Dt. contato:&nbsp;</label>
        <InputBox className="uk-margin-small-top uk-width-1-1">
          <DatePicker
            className="custom-datepicker"
            format={"DD/MM/YYYY"}
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.contactFrom}
            onChange={(val) =>
              setFilters((prv) => ({
                ...prv,
                contactFrom: val,
              }))
            }
          />
          &nbsp;à&nbsp;
          <DatePicker
            className="uk-margin-right custom-datepicker"
            format={"DD/MM/YYYY"}
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.contactTo}
            onChange={(val) =>
              setFilters((prv) => ({
                ...prv,
                contactTo: val,
              }))
            }
          />
          &nbsp;
          <MdOutlineClear
            size={40}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setFilters((prv) => ({
                ...prv,
                contactFrom: null,
                contactTo: null,
              }));
            }}
          />
          <Tooltip
            trigger={<Icon name="IconInfo" />}
            content={
              <>
                Esta consulta retorna as oportunidades que tiveram o contato{" "}
                <br />
                realizado pelo cliente dentro do Periodo Selecionado. Esta é a{" "}
                <br />
                data que é selecionada no momento de cadastrar a oportunidade no{" "}
                <br />
                Crm
              </>
            }
          />
        </InputBox>
      </div>
      <div className="uk-width-1-4">
        <label>Unidade</label>
        <InputBox className="uk-width-1-1">
          <Select
            placeholder="Unidade"
            allowClear
            mode="multiple"
            className="uk-width-1-1"
            value={filters?.unit}
            onChange={(val) => {
              if (val == "all") {
                const newObj = { ...filters };
                delete newObj.unit;
                return setFilters(newObj);
              }
              setFilters((prv) => ({ ...prv, unit: val }));
              return setReload((prv) => !prv);
            }}
          >
            <Option value="all">Todos</Option>
            {businessUnits.length > 0 &&
              businessUnits.map((unit) => (
                <Option value={unit?.id}>{unit?.identification}</Option>
              ))}
          </Select>
        </InputBox>

        <div
          style={{ width: "100%", marginTop: 30, display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            className=""
            onClick={() => {
              setFilters((prv) => ({ ...prv, noSearch: false }));
              setReload((prv) => !prv);
            }}
            text="Filtrar"
          />
        </div>
      </div>
    </section>
  );
}

export default Filters;
