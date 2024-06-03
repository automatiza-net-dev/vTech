// @ts-nocheck
import { memo, useState, useEffect } from "react";

import { useColaborators } from "@/OLD/hooks/useColaborators";
import { useSuppliers } from "@/OLD/hooks/useSuppliers";

import { DatePicker } from "@mui/x-date-pickers";
import { Input, AutoComplete, Button } from "antd";
import { Container } from "./styles";
import { InputBox } from "./styles";

import { MdOutlineClear } from "react-icons/md";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { sortItems } from "@/OLD/utils/sortItems";

const Filters = memo(function Filters({ filters, setFilters, setReload }) {
  const [values, setValues] = useState({});

  const { colaborators } = useColaborators();
  const { suppliers } = useSuppliers();

  sortItems(colaborators, "name");
  sortItems(suppliers, "name");

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        setFilters({ ...filters, noSearch: false });
        setReload((prv) => !prv);
      }
    });
  }, []);

  return (
    <Container className="uk-margin-small-top">
      <section className="uk-flex uk-flex-around" style={{ gap: "10px" }}>
        <InputBox>
          <label>Período lançamento:&nbsp;</label>
          <DatePicker
            value={filters?.from}
            onChange={(val) => {
              setFilters({ ...filters, from: val });
              if (val === null) {
                const obj = { ...filters };
                delete obj?.from;
                setFilters(obj);
              }
            }}
            slotProps={{ textField: { variant: "standard" } }}
          />
          &nbsp;à&nbsp;
          <DatePicker
            value={filters?.to}
            onChange={(val) => {
              setFilters({ ...filters, to: val });
              if (val === null) {
                const obj = { ...filters };
                delete obj?.to;
                setFilters(obj);
              }
            }}
            slotProps={{ textField: { variant: "standard" } }}
          />
          <MdOutlineClear
            size={40}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setFilters((prv) => ({
                ...prv,
                from: null,
                to: null,
              }));
            }}
          />
        </InputBox>
        <InputBox className="uk-width-1-5">
          <label>Código entrada:</label>
          &nbsp;
          <Input
            placeholder="Código entrada"
            value={filters?.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          />
        </InputBox>
        <InputBox className="uk-width-1-4">
          <label>Funcionário:</label>
          &nbsp;
          <AutoComplete
            className="uk-width-1-1"
            placeholder="Vendedor"
            value={values?.techName}
            allowClear
            onClear={() => {
              setValues({});
              let newObj = { ...filters };
              delete newObj?.seller;
              setFilters(newObj);
            }}
            options={colaborators?.map((colab) => ({
              ...colab,
              value: colab?.name,
              key: colab?.id,
            }))}
            onChange={(val) => {
              const newObj = { ...filters };
              setValues({ ...values, techName: val });
              delete newObj?.seller;
              setFilters(newObj);
            }}
            onSelect={(_val, opt) => {
              setValues({ ...values, techName: opt?.value });
              setFilters({ ...filters, seller: opt?.id });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.value.toUpperCase()).includes(
                normalizeStr(val.toUpperCase())
              )
            }
          />
        </InputBox>

        <InputBox className="uk-width-1-4">
          <label>Forncedor:&nbsp;</label>
          <AutoComplete
            allowClear
            className="uk-width-1-1"
            placeholder="Fornecedor"
            options={suppliers?.map((sup) => ({
              ...sup,
              value: sup?.name,
              key: sup?.id,
            }))}
            onChange={(val) => setValues({ ...values, supName: val })}
            onSelect={(_, opt) => {
              setValues({ ...values, supName: opt?.value });
              setFilters({ ...filters, supplier: opt?.id });
            }}
            filterOption={(val, opt) =>
              normalizeStr(opt?.value?.toUpperCase()).includes(
                normalizeStr(val).toUpperCase()
              )
            }
          />
        </InputBox>
        <Button
          className=""
          type="primary"
          onClick={() => {
            setFilters({ ...filters, noSearch: false });
            setReload((prv) => !prv);
          }}
        >
          Filtrar
        </Button>
      </section>
    </Container>
  );
});

export default Filters;
