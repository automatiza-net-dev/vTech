import { useRouter } from "next/router";
import { FormHandler, Input, Select, Button } from "infinity-forge";

import { useLoadSubgroups } from "@/presentation";
import { CreateVaccine, EditVaccine } from "@/domain";
import React from "react";

import * as S from "./styles";

// TODO: Verificar tipagem React.dispatch, anterior: CreateVaccine.Params e tipagem de função submit

export function VaccineForm(props: {
  data: CreateVaccine.Params | EditVaccine.Params;
  setData: React.Dispatch<React.SetStateAction<any>>;
  submit: any;
  created: boolean;
  edit: boolean;
  type: "vaccine" | "vermifuge";
}) {
  const subgroups = useLoadSubgroups({});

  return (
    <S.VaccineForm>
      <h2>
        {!props.edit
          ? `Cadastrar ${props?.type === "vaccine" ? "Vacina" : "Vermifugo"} `
          : `Editar ${props?.type === "vaccine" ? "Vacina" : "Vermifugo"}`}
      </h2>
      <FormHandler
        initialData={props.data}
        onChangeForm={{ callbackResult: (prv) => props.setData(prv) }}
        cleanFieldsOnSubmit={false}
      >
        <section>
          <Input
            label={`Nome ${
              props?.type === "vaccine" ? "da vacina" : "do vermífugo"
            }`}
            name="name"
            readOnly={props.created && !props.edit}
          />
          <Input
            label="Descrição"
            name="description"
            readOnly={props.created && !props.edit}
          />
          {subgroups.data?.length > 0 && (
            <div>
              <label>Subgrupo</label>

              <Select
                disabled={props.created && !props.edit}
                menuPlacement="top"
                name="subgroupId"
                options={subgroups.data.map((group) => ({
                  value: group?.id,
                  label: group?.description,
                }))}
                onlyOneValue
                value={props.data.subgroupId}
              />
            </div>
          )}
        </section>
      </FormHandler>
      <footer>
        {(!props.created || props.edit) && (
          <Button text="Salvar" onClick={props.submit} />
        )}
      </footer>
    </S.VaccineForm>
  );
}
