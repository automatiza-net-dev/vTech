// @ts-nocheck
import { memo } from "react";

import { DateFilter } from "@/OLD/components/mini-components";
import { DatePicker } from "@mui/x-date-pickers";
import { InputBox } from "../styles";
import { Input, Select } from "antd";

import { MdOutlineClear } from "react-icons/md";

const types = [
  { id: 1, value: "Internação" },
  { id: 2, value: "Observação" },
  { id: 3, value: "UTI" },
];

const Filters = memo(function Filters({ filters, setFilters }) {
  return (
    <section>
      <div className="uk-flex" style={{ gap: "5px" }}>
        <div>
          <div className="uk-flex">
            <label>Período abertura internação</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"hospitalized_from"}
              to={"hospitalized_to"}
            />
          </div>
          <InputBox>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              type="date"
              value={filters?.hospitalized_from}
              onChange={(val) =>
                setFilters((prv) => ({ ...prv, hospitalized_from: val }))
              }
            />
            &nbsp;&nbsp;à&nbsp;&nbsp;
            <DatePicker
              className="uk-margin-small-right"
              slotProps={{ textField: { variant: "standard" } }}
              type="date"
              value={filters?.hospitalized_to}
              onChange={(val) =>
                setFilters((prv) => ({ ...prv, hospitalized_to: val }))
              }
            />
            <MdOutlineClear
              size={40}
              style={{ cursor: "pointer" }}
              onClick={() =>
                setFilters((prv) => ({
                  prv,
                  hospitalized_from: null,
                  hospitalized_to: null,
                }))
              }
            />
          </InputBox>
        </div>
        <div>
          <div className="uk-flex">
            <label>Período data Alta</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"released_from"}
              to={"released_to"}
            />
          </div>
          <InputBox>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              type="date"
              value={filters?.releasead_from}
              onChange={(val) =>
                setFilters((prv) => ({ ...prv, releasead_from: val }))
              }
            />
            &nbsp;&nbsp;à&nbsp;&nbsp;
            <DatePicker
              className="uk-margin-small-right"
              slotProps={{ textField: { variant: "standard" } }}
              type="date"
              value={filters?.releasead_to}
              onChange={(val) =>
                setFilters((prv) => ({ ...prv, releasead_to: val }))
              }
            />
            <MdOutlineClear
              size={40}
              style={{ cursor: "pointer" }}
              onClick={() =>
                setFilters((prv) => ({
                  prv,
                  releasead_from: null,
                  releasead_to: null,
                }))
              }
            />
          </InputBox>
        </div>
        <div>
          <div className="uk-flex">
            <label>Período Finalização int.</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"finished_from"}
              to={"finished_to"}
            />
          </div>
          <InputBox>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              type="date"
              value={filters?.finished_from}
              onChange={(val) =>
                setFilters((prv) => ({ ...prv, finished_from: val }))
              }
            />
            &nbsp;&nbsp;à&nbsp;&nbsp;
            <DatePicker
              className="uk-margin-small-right"
              slotProps={{ textField: { variant: "standard" } }}
              type="date"
              value={filters?.finished_to}
              onChange={(val) =>
                setFilters((prv) => ({ ...prv, finished_to: val }))
              }
            />
            <MdOutlineClear
              size={40}
              style={{ cursor: "pointer" }}
              onClick={() =>
                setFilters((prv) => ({
                  prv,
                  finished_from: null,
                  finished_to: null,
                }))
              }
            />
          </InputBox>
        </div>
        <div>
          <div className="uk-flex">
            <label>Período data óbito</label>
            <DateFilter
              state={filters}
              setState={setFilters}
              from={"death_from"}
              to={"death_to"}
            />
          </div>
          <InputBox>
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              type="date"
              value={filters?.death_from}
              onChange={(val) =>
                setFilters((prv) => ({ ...prv, death_from: val }))
              }
            />
            &nbsp;&nbsp;à&nbsp;&nbsp;
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              type="date"
              value={filters?.death_to}
              onChange={(val) =>
                setFilters((prv) => ({ ...prv, death_to: val }))
              }
            />
            <MdOutlineClear
              size={40}
              style={{ cursor: "pointer" }}
              onClick={() =>
                setFilters((prv) => ({ prv, death_from: null, death_to: null }))
              }
            />
          </InputBox>
        </div>
      </div>
      <div className="uk-flex uk-margin-small-top" style={{ gap: "5px" }}>
        <InputBox className="uk-margin-top uk-width-1-3">
          <label>Tutor</label>
          <Input
            value={filters?.tutorName}
            onChange={(e) =>
              setFilters((prv) => ({ ...prv, tutorName: e.target.value }))
            }
          />
        </InputBox>
        <InputBox className="uk-margin-top uk-width-1-3">
          <label>Status internação</label>
          <Select
            className="uk-width-1-1"
            value={filters?.status}
            onChange={(val) => setFilters((prv) => ({ ...prv, status: val }))}
          >
            <Option value="aberto">aberto</Option>
            <Option value="alta">alta</Option>
            <Option value="finalizadas">finalizadas</Option>
            <Option value="obito">obito</Option>
          </Select>
        </InputBox>
        <InputBox className="uk-margin-top uk-width-1-3">
          <label>Paciente</label>
          <Input
            value={filters?.patientName}
            onChange={(e) =>
              setFilters((prv) =>
                setFilters({ ...prv, patientName: e.target.value })
              )
            }
          />
        </InputBox>
        <InputBox className="uk-margin-top uk-width-1-3">
          <label>RG Paciente</label>
          <Input
            value={filters?.patientTag}
            onChange={(e) =>
              setFilters((prv) =>
                setFilters({ ...prv, patientTag: e.target.value })
              )
            }
          />
        </InputBox>
        <InputBox className="uk-margin-top uk-width-1-3">
          <label>Tipo Internação</label>
          <Select
            className="uk-width-1-1"
            value={filters?.type}
            onChange={(val) => setFilters((prv) => ({ ...prv, type: val }))}
          >
            {types?.map((type) => (
              <Option value={type?.id}>{type?.value}</Option>
            ))}
          </Select>
        </InputBox>
      </div>
    </section>
  );
});

export default Filters;
