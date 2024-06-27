import { CreateVaccineProtocol, EditVaccineProtocol } from "@/domain";
import { useLoadAllSpecies } from "@/presentation";

import * as S from "./styles";

import { Input, Select, FormHandler } from "infinity-forge";

const dosageList = Array.from(Array(10), (_, i) => 10 - i);

// TODO: Verificar tipagem React.dispatch, anterior: CreateVaccine.Params e tipagem de função submit

export function ProtocolForm(props: {
  data: CreateVaccineProtocol.Params | EditVaccineProtocol.Params;
  setData: React.Dispatch<React.SetStateAction<any>>;
  submit: any;
}) {
  const species = useLoadAllSpecies({});

  return (
    <S.ProtocolForm>
      <FormHandler
        initialData={props.data}
        onSucess={() => props.submit()}
        button={{ text: "Salvar" }}
        onChangeForm={{ callbackResult: (prv) => props.setData(prv) }}
      >
        <section>
          <Input name="name" label="Nome" />
          {species?.data && (
            <div>
              <label>Especie</label>

              <Select
                menuPlacement="bottom"
                name="specieId"
                options={species.data.map((specie) => ({
                  value: specie?.id,
                  label: specie?.description,
                }))}
                onlyOneValue
                value={props.data.specieId}
              />
            </div>
          )}
          <Input name="interval" label="Intervalo (Em dias)" type="number" />
          <div>
            <label>Qtd. Doses</label>

            <Select
              menuPlacement="top"
              name="doses"
              options={dosageList.map((dose) => ({
                value: dose,
                label: `${dose} Doses`,
              }))}
              onlyOneValue
              value={props.data.doses}
            />
          </div>
        </section>
      </FormHandler>
    </S.ProtocolForm>
  );
}
