import { LoadAllPatientReports } from "@/domain";

import {
  FormHandler,
  Select,
  updateRoute,
  useQueryClient,
} from "infinity-forge";

import { useRouter } from "next/router";

import {
  useLoadAllRaces,
  useLoadAllSpecies,
  useLoadAllPatientReports,
} from "@/presentation";
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
            options={[
              { label: "Femea", value: "Femea" },
              { label: "Macho", value: "Macho" },
            ]}
          />
          <Select
            label="Castrado"
            name="castrated"
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Nao" },
            ]}
          />
          <Select
            label="Protocolos"
            name="protocol"
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
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Nao" },
            ]}
          />
          <Select
            label="Microchip"
            name="microchip"
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Nao" },
            ]}
          />
          <Select
            label="Comunidade Sancla"
            name="community"
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Nao" },
            ]}
          />
          <Select
            label="Vacinado"
            name="vaccineOrigin"
            options={[
              { label: "Vacinado", value: "Vacinado" },
              { label: "Nao Vacinado", value: "Nao vacinado" },
            ]}
          />
          <ExportButton />
        </section>
      </FormHandler>
    </S.Filters>
  );
}
