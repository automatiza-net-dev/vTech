import { CreateVaccineProtocol, EditVaccineProtocol } from "@/domain";
import { useLoadAllSpecies } from "@/presentation";

import * as S from "./styles";

import { Input, Select, FormHandler } from "infinity-forge";

const dosageList = Array.from(Array(10), (_, i) => 10 - i);

import * as Yup from "yup";

export function ProtocolForm(props: {
  data: CreateVaccineProtocol.Params | EditVaccineProtocol.Params;
  setData: React.Dispatch<React.SetStateAction<any>>;
  submit: any;
}) {
  const species = useLoadAllSpecies({});

  const protocolSchema = {
    name: Yup.string().required("Campo obrigatório"),
  };

  return (
    <S.ProtocolForm>
      <FormHandler
        schema={protocolSchema}
        initialData={props.data}
        onSucess={() => props.submit()}
        cleanFieldsOnSubmit={false}
        customSubmit={[
          {
            action: () => props.submit(),
            active: true,
            props: {
              text: "Salvar",
            },
          },
        ]}
        onChangeForm={{ callbackResult: (prv) => props.setData(prv) }}
      >
        <section>
          <Input name="name" label="Nome" className="box-1" />
          {species?.data && (
            <div className="box-2">
              <Select
                label="Especie"
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
        </section>
        <div className="down-box">
          <div>
            <Select
              label="Qtd. Doses"
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
          <Input name="interval" label="Intervalo (Em dias)" type="number" />
          <Input
            type="number"
            label="Valido por (Em dias)"
            name="expirationDays"
          />
        </div>
      </FormHandler>
    </S.ProtocolForm>
  );
}
