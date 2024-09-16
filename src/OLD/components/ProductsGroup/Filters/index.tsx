// @ts-nocheck
import React, { memo } from "react";

import { Container, InputBox } from "./styles";
import { Input } from "antd";
import { DatePicker } from "@mui/x-date-pickers";

const Filters = memo(function Filters({ setFilters, filters }) {
  return (
    <Container style={{ display: "flex", gap: "10px" }}>
      <div>
        <label>Código</label>
        <InputBox>
          <Input
            placeholder="Código"
            value={filters?.id}
            onChange={(e) => setFilters({ ...filters, id: e.target.value })}
          />
        </InputBox>
      </div>
      <div>
        <label>Descrição</label>
        <InputBox>
          <Input
            placeholder="Descrição"
            value={filters?.description}
            onChange={(e) =>
              setFilters({ ...filters, description: e.target.value })
            }
          />
        </InputBox>
      </div>
      <div>
        <label>Cod. Produto</label>
        <InputBox>
          <Input
            placeholder="Cód. Produto"
            value={filters?.productCode}
            onChange={(e) =>
              setFilters({ ...filters, productCode: e.target.value })
            }
          />
        </InputBox>
      </div>
      <div>
        <label>Data inicio</label>
        <InputBox>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            placeholder="Data Inicio"
            value={filters?.fromExpiration}
            format="DD/MM/YYYY"
            onChange={(e) => setFilters({ ...filters, fromExpiration: e })}
          />
        </InputBox>
      </div>
      <div>
        <label> Data Fim</label>
        <InputBox>
          <DatePicker
            slotProps={{ textField: { variant: "standard" } }}
            placeholder="Data Fim"
            format="DD/MM/YYYY"
            value={filters?.toExpiration}
            onChange={(e) => setFilters({ ...filters, toExpiration: e })}
          />
        </InputBox>
      </div>
    </Container>
  );
});

export default Filters;
