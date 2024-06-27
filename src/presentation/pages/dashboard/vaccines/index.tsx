import { useState } from "react";

import { useLoadAllVaccinesProtocols } from "@/presentation";

import { ProtocolsTable } from "./components/protocols-table";

import { LayoutDashboard } from "@/presentation";
import { Input, FormHandler } from "infinity-forge";
import { CreateVaccine } from "./components";
import { EditVaccine } from "./components/actions";
import { DeleteVaccine } from "./components/actions/delete-vaccine";

import * as S from "./styles";

export function VaccinesProtocols(props: { type: "vaccine" | "vermifuge" }) {
  const [params, setParams] = useState({ fetch: true, type: props.type });

  const vaccinesProtocols = useLoadAllVaccinesProtocols(params);

  const protocolsTableProps = {
    data: vaccinesProtocols.data,
    actions: [DeleteVaccine, EditVaccine],
    type: props?.type === 'vaccine' ? "Vacina" : "Vermifugo",
  };

  return (
    <LayoutDashboard>
      <S.Vaccine>
        <h2>
          {props.type === "vaccine"
            ? "Gestão de vacinas"
            : "Gestão de vermifugo"}
        </h2>
        <FormHandler
          initialData={params}
          onChangeForm={{ callbackResult: (prv) => setParams(prv) }}
        >
          <section>
            <Input name="name" label="Nome" />
            <Input name="specie" label="Espécie" />
          </section>
        </FormHandler>
        <CreateVaccine type={props.type} />
        <hr />
        {vaccinesProtocols?.data && vaccinesProtocols?.data.length > 0 && (
          <ProtocolsTable {...protocolsTableProps} />
        )}
      </S.Vaccine>
    </LayoutDashboard>
  );
}
