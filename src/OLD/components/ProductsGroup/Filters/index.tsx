// @ts-nocheck
import React, { memo } from "react";

import { Container, InputBox } from "./styles";
import { Input } from "antd";
import { DatePicker } from "@mui/x-date-pickers";

const Filters = memo(function Filters({ setFilters, filters }) {
  return (
    <Container className="uk-margin-top uk-flex uk-flex-around">
      <InputBox>
        <Input
          placeholder="Código"
          value={filters?.id}
          onChange={(e) => setFilters({ ...filters, id: e.target.value })}
        />
      </InputBox>
      <InputBox>
        <Input
          placeholder="Descrição"
          value={filters?.description}
          onChange={(e) =>
            setFilters({ ...filters, description: e.target.value })
          }
        />
      </InputBox>
      <InputBox>
        <Input
          placeholder="Cód. Produto"
          value={filters?.productCode}
          onChange={(e) =>
            setFilters({ ...filters, productCode: e.target.value })
          }
        />
      </InputBox>
      <InputBox>
        <DatePicker
          slotProps={{ textField: { variant: "standard" } }}
          placeholder="Data Inicio"
          value={filters?.fromExpiration}
          format="DD/MM/YYYY"
          onChange={(e) => setFilters({ ...filters, fromExpiration: e })}
        />
      </InputBox>
      <InputBox>
        <DatePicker
          slotProps={{ textField: { variant: "standard" } }}
          placeholder="Data Fim"
          format="DD/MM/YYYY"
          value={filters?.toExpiration}
          onChange={(e) => setFilters({ ...filters, toExpiration: e })}
        />
      </InputBox>
    </Container>
  );
});

export default Filters;
