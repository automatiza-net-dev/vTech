// @ts-nocheck
import { useState, memo } from "react";

import { useBusinessUnitsByUser } from "@/OLD/hooks/useBusinessUnits";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useAuth } from "@/OLD/hooks/useAuth";

import { DateFilter } from "@/OLD/components/mini-components";
import { Input, AutoComplete, Select } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import { Container, InputBox } from "./styles";
import { Button, Icon, Tooltip, useAuthAdmin } from "infinity-forge";
const { Option } = Select;

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

import { MdOutlineClear } from "react-icons/md";

function Filters({ filters, setFilters, setReload, actTypes, colaborators }) {
  const [values, setValues] = useState({});

  const { user } = useAuthAdmin();
  const allBusinessUnits = useBusinessUnitsByUser();

  const viewAllActivitiesPermission = useUserHasPermission("CRM09");

  return (
    <Container>
      <section>
        <div>
          <label>Data Atividade</label>
          <DateFilter
            state={filters}
            setState={setFilters}
            from={"fromDate"}
            to={"toDate"}
          />
          <InputBox>
            <DatePicker
              format="DD/MM/YYYY"
              className="custom-date-component"
              slotProps={{ textField: { variant: "standard" } }}
              value={filters?.fromDate}
              onChange={(val) => setFilters({ ...filters, fromDate: val })}
            />
            <p>à</p>
            <DatePicker
              className="custom-date-component"
              slotProps={{ textField: { variant: "standard" } }}
              format="DD/MM/YYYY"
              value={filters?.toDate}
              onChange={(val) => setFilters({ ...filters, toDate: val })}
            />
            <MdOutlineClear
              size={30}
              style={{
                cursor: "pointer",
                marginBottom: "5px",
                marginLeft: "5px",
              }}
              onClick={() => {
                setFilters((prv) => ({
                  ...prv,
                  fromDate: null,
                  toDate: null,
                }));
              }}
            />
            <Tooltip
              trigger={<Icon name="IconInfo" />}
              content={
                <>
                  Esta consulta retorna as atividades que estão agendadas para{" "}
                  <br />
                  execução dentro do Periodo Selecionado;
                </>
              }
            />
          </InputBox>
        </div>
        <div>
          <label>Atividade</label>
          <InputBox>
            <AutoComplete
              style={{ width: "100%" }}
              allowClear
              onClear={() => {
                const newObj = { ...filters };
                delete newObj?.description;
                setFilters(newObj);
              }}
              value={filters?.description}
              options={actTypes?.map((type) => ({
                ...type,
                value: type?.description,
              }))}
              onChange={(val) => setFilters({ ...filters, description: val })}
              onSelect={(_val, opt) => {
                setFilters({ ...filters, description: opt?.value });
                setReload((prv) => !prv);
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.value?.toUpperCase()).includes(
                  normalizeStr(val?.toUpperCase())
                )
              }
            />
          </InputBox>
        </div>
        <div>
          <label>Status</label>
          <InputBox>
            <Select
              style={{ width: "100%" }}
              value={filters?.status}
              onChange={(val) => {
                setFilters({ ...filters, status: val });
                setReload((prv) => !prv);
              }}
            >
              <Option value="all">Todos</Option>
              <Option value="Aberta">Em aberto</Option>
              <Option value="Executada">Executada</Option>
            </Select>
          </InputBox>
        </div>

        {viewAllActivitiesPermission && (
          <div>
            <label>Profissional Responsável</label>
            <InputBox>
              <AutoComplete
                style={{ width: "100%" }}
                allowClear
                onClear={() => {
                  const newObj = { ...filters };
                  delete newObj?.technicianName;
                  setFilters(newObj);
                }}
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
                  delete newObj?.technicianName;
                  setFilters(newObj);
                }}
                onSelect={(_val, opt) => {
                  setValues({ ...values, techName: opt?.value });
                  setFilters({ ...filters, technicianName: opt?.value });
                  setReload((prv) => !prv);
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val.toUpperCase())
                  )
                }
              />
            </InputBox>
          </div>
        )}
        <div>
          <label>Cliente</label>
          <InputBox>
            <Input
              value={filters?.contactName}
              onChange={(e) =>
                setFilters((prv) => ({ ...prv, contactName: e.target.value }))
              }
            />
          </InputBox>
        </div>
        <div>
          <label>Fone</label>
          <InputBox>
            <Input
              onChange={(e) =>
                setFilters((prv) => ({ ...prv, contactPhone: e.target.value }))
              }
            />
          </InputBox>
        </div>
        {user?.type === "Vet" && (
          <div>
            <label>Nome pet</label>
            <InputBox>
              <Input
                value={filters?.patientName}
                onChange={(e) =>
                  setFilters({ ...filters, patientName: e.target.value })
                }
              />
            </InputBox>
          </div>
        )}
        {allBusinessUnits?.businessUnits && (
          <div>
            <label>Unidade</label>
            <InputBox className="uk-width-1-1">
              <Select
                style={{ width: "100%" }}
                mode="multiple"
                className="uk-width-1-1"
                value={filters?.unit}
                onChange={(val) => {
                  setFilters({ ...filters, unit: val });
                  setReload((prv) => !prv);
                }}
              >
                {allBusinessUnits?.businessUnits?.map((unit) => (
                  <Option value={unit?.id}>{unit?.identification}</Option>
                ))}
              </Select>
            </InputBox>
          </div>
        )}
      </section>
      <div className="button-container">
        <Button
          onClick={() => {
            setFilters((prv) => ({ ...prv, noSearch: false }));
            setReload((prv) => !prv);
          }}
          text="Filtrar"
        />
      </div>
    </Container>
  );
}

export default Filters;
