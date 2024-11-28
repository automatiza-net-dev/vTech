import { useState, useEffect } from "react";

import { useLoadAllVaccinesProtocols } from "@/presentation";
import { useQueryClient } from "react-query";

import { ProtocolsTable } from "./components/protocols-table";

import { CreateVaccine } from "./components";
import { LayoutDashboard } from "@/presentation";
import { EditVaccine } from "./components/actions";
import { DeleteVaccine } from "./components/actions/delete-vaccine";
import { Input, FormHandler, PageWrapper, Button } from "infinity-forge";

import * as S from "./styles";

export function VaccinesProtocols(props: { type: "vaccine" | "vermifuge" }) {
  const [params, setParams] = useState({ fetch: false });

  const queryClient = useQueryClient();
  const vaccinesProtocols = useLoadAllVaccinesProtocols(params);

  const protocolsTableProps = {
    data: vaccinesProtocols.data,
    actions: [DeleteVaccine, EditVaccine],
    type: props?.type === "vaccine" ? "Vacina" : "Vermifugo",
  };

  useEffect(() => {
    queryClient.removeQueries();
  }, []);

  return (
    <LayoutDashboard>
      <PageWrapper
        title={
          props.type === "vaccine" ? "Gestão de vacinas" : "Gestão de vermifugo"
        }
      >
        <S.Vaccine>
          <section>
            <FormHandler
              initialData={params}
              onChangeForm={{ callbackResult: (prv) => setParams(prv) }}
            >
              <section className="input-container">
                <Input name="name" label="Nome" />
                <Input name="specie" label="Espécie" />
              </section>
            </FormHandler>
            <div className="buttons-container">
              <Button
                text="Filtrar"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  vaccinesProtocols.mutate();
                  setParams((prv) => ({ ...prv, fetch: true }));
                }}
              />
              <CreateVaccine type={props.type} />
            </div>
          </section>

          <hr />

          {vaccinesProtocols?.data && !vaccinesProtocols?.isLoading && (
            <ProtocolsTable {...protocolsTableProps} />
          )}
        </S.Vaccine>
      </PageWrapper>
    </LayoutDashboard>
  );
}
