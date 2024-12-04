import { LoadAllPatientReports } from "@/domain";

import { FormHandler, Select, updateRoute } from "infinity-forge";

import { useRouter } from "next/router";

import { useLoadAllRaces, useLoadAllSpecies } from "@/presentation";
import { ExportButton } from "../export-button";

import * as S from "./styles";

export function Filters() {
  const initialData = {};

  const router = useRouter();
  const races = useLoadAllRaces({});
  const species = useLoadAllSpecies({});

  return (
    <S.Filters>
      <FormHandler
        initialData={initialData}
        onChangeForm={{
          callbackResult: (payload: LoadAllPatientReports.Params) => {
            updateRoute({
              params: payload,
              router,
            });
          },
        }}
      >
        <section>
          {races?.data && (
            <Select
              name="races"
              isMultiple
              label="Raça"
              options={races?.data?.map((race) => ({
                label: race?.description,
                value: race?.id,
              }))}
            />
          )}
          {species?.data && (
            <Select
              name="species"
              isMultiple
              label="Espécie"
              options={species?.data?.map((specie) => ({
                label: specie?.description,
                value: specie?.id,
              }))}
            />
          )}
          <Select
            label="Genêro"
            name="gender"
            isClearable
            options={[
              { label: "Fêmea", value: "Femea" },
              { label: "Macho", value: "Macho" },
            ]}
          />
          <Select
            label="Castrado"
            name="castrated"
            isClearable
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Nao" },
            ]}
          />
          <Select
            label="Protocolos"
            name="protocol"
            isClearable
            options={[
              { label: "Protocolos atrasados", value: "Protocolos Atrasados" },
              { label: "Protocolos Vencidos", value: "Protocolos Vencidos" },
              { label: "Protocolos a vencer", value: "Protocolos a vencer" },
              {
                label: "Protocolos para agendar",
                value: "Protocolos para agendar",
              },
            ]}
          />
        </section>
        <section>
          <Select
            label="Óbito"
            name="death"
            isClearable
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Nao" },
            ]}
          />
          <Select
            label="Microchip"
            name="microchip"
            isClearable
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Nao" },
            ]}
          />
          <Select
            label="Comunidade Sancla"
            name="community"
            isClearable
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Nao" },
            ]}
          />
          <Select
            label="Vacinado"
            name="vaccineOrigin"
            isClearable
            options={[
              { label: "Vacinado", value: "Vacinado" },
              { label: "Não Vacinado", value: "Nao vacinado" },
            ]}
          />
          <ExportButton />
        </section>
      </FormHandler>
    </S.Filters>
  );
}
