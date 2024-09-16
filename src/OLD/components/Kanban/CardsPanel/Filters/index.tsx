// @ts-nocheck
import { memo, useState, useEffect } from "react";

import { usePatients } from "@/OLD/hooks/usePatients";
// import { useTutor } from "@/OLD/hooks/useTutor";
import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useProfile } from "@/OLD/hooks/useProfile";

import { Checkbox, AutoComplete, Select, Input } from "antd";
import { Button } from "infinity-forge";
import { DatePicker } from "@mui/x-date-pickers";
import { InputBox } from "./styles";
const { Option } = Select;

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

import { MdOutlineClear } from "react-icons/md";

const Filters = memo(function Filters({ filters, setFilters, setReload }) {
  const [values, setValues] = useState({});

  const { patients } = usePatients(
    false,
    false,
    process.env.client !== "sancla"
  );
  const { colaborators } = useColaborators();
  const { businessUnits } = useBusinessUnitsByUser(false);
  const { user } = useProfile();

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
        <label>{process.env.client === "liftone" ? "Cliente" : "Tutor"}</label>
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
              setFilters({
                ...filters,
                dateFrom: val,
              })
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
              setFilters({
                ...filters,
                dateTo: val,
              })
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
                  setFilters({ ...filters, technician: opt?.id });
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
        <label>Dt Abertura:&nbsp;</label>
        <InputBox className="uk-width-1-1 uk-margin-small-top">
          <DatePicker
            format={"DD/MM/YYYY"}
            className="custom-datepicker"
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.openingFrom}
            onChange={(val) =>
              setFilters({
                ...filters,
                openingFrom: val,
              })
            }
          />
          &nbsp;à&nbsp;
          <DatePicker
            className="uk-margin-right custom-datepicker"
            format={"DD/MM/YYYY"}
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.openingTo}
            onChange={(val) =>
              setFilters({
                ...filters,
                openingTo: val,
              })
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
              setFilters({ ...filters, unit: val });
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
        <label>Dt. contato:&nbsp;</label>
        <InputBox className="uk-margin-small-top uk-width-1-1">
          <DatePicker
            className="custom-datepicker"
            format={"DD/MM/YYYY"}
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.contactFrom}
            onChange={(val) =>
              setFilters({
                ...filters,
                contactFrom: val,
              })
            }
          />
          &nbsp;à&nbsp;
          <DatePicker
            className="uk-margin-right custom-datepicker"
            format={"DD/MM/YYYY"}
            slotProps={{ textField: { variant: "standard" } }}
            value={filters?.contactTo}
            onChange={(val) =>
              setFilters({
                ...filters,
                contactTo: val,
              })
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
        </InputBox>
      </div>
      <div className="uk-width-1-4 uk-margin-left">
        {process.env.client !== "liftone" && (
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
              setFilters({ ...filters, orderBy: val });
              return setReload((prv) => !prv);
            }}
          >
            <Option value="contactDate">Data Contato</Option>
            <Option value="openingDate">Data Abertura</Option>
            <Option value="contact">Nome cliente</Option>
            {process.env.client !== "liftone" && (
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
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
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
});

export default Filters;
