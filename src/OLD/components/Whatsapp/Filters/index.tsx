import React, { Dispatch, memo, SetStateAction } from "react";

import { Input } from "antd";
import { InputBox } from "../styles";

import { normalizeStr } from "@/OLD/utils/normalizeString";

const Filters = memo(function Filters(props: {
  filters: Record<string, string>;
  setFilters: Dispatch<SetStateAction<Record<string, string>>>;
  shouldRefetch: () => void;
}) {
  return (
    <section className="uk-margin-top">
      <section style={{ display: "flex", width: "100%" }}>
        <div style={{ width: "25%" }}>
          <label htmlFor="phone">Telefone</label>
          <InputBox>
            <Input
              placeholder="Telefone"
              onChange={(e) =>
                props.setFilters({
                  ...props.filters,
                  whatsappPhone: normalizeStr(e.target.value),
                })
              }
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  props.shouldRefetch();
                }
              }}
            />
          </InputBox>
        </div>

        <div style={{ width: "25%" }}>
          <label htmlFor="platformIntegration">Plataforma</label>
          <InputBox>
            <Input
              placeholder="Plataforma"
              onChange={(e) =>
                props.setFilters({
                  ...props.filters,
                  platformIntegration: normalizeStr(e.target.value),
                })
              }
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  props.shouldRefetch();
                }
              }}
            />
          </InputBox>
        </div>

        <div style={{ width: "25%" }}>
          <label htmlFor="status">Status</label>
          <InputBox>
            <Input
              placeholder="Status"
              onChange={(e) =>
                props.setFilters({
                  ...props.filters,
                  status: normalizeStr(e.target.value),
                })
              }
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  props.shouldRefetch();
                }
              }}
            />
          </InputBox>
        </div>

        <div style={{ width: "25%" }}>
          <label htmlFor="connectionStatus">Status Conexão</label>
          <InputBox>
            <Input
              placeholder="Status Conexão"
              onChange={(e) =>
                props.setFilters({
                  ...props.filters,
                  connectionStatus: normalizeStr(e.target.value),
                })
              }
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  props.shouldRefetch();
                }
              }}
            />
          </InputBox>
        </div>
      </section>
    </section>
  );
});

export default Filters;
