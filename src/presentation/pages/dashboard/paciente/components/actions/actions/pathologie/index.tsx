import {
  Error,
  Select,
  Textarea,
  TextEditor,
  FormHandler,
  useToast,
} from "infinity-forge";
import moment from "moment";

import { RemotePatientAnimal } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import { useLoadAllPathologies, useLoadPatient, useMe } from "@/presentation";

import * as Type from "../dropdown-item";

import * as S from "./styles";

export function Pathologie({ setModal }: Type.DropdownComponentProps) {

  const me = useMe();
  const patient = useLoadPatient();
  const { createToast} = useToast();
  const { data, isFetching } = useLoadAllPathologies();

  return (
    <Error name="Pathologie">
      <S.Patology>
        <FormHandler
          button={{ text: "Salvar" }}
          onSucess={async (data) => {
            const payload = {
              ...data,
              tag: patient.data?.id,
              realizedAt: moment(),
              technicianId: me.data?.user.id,
            };

            await container.get<RemotePatientAnimal>(TypesAutomatiza.RemotePatientAnimal).addPathologieInTimeLine(payload)

            createToast({ message: "Patologia registrada com sucesso!", status: "success" })

            setModal && setModal(false);
          }}
          disableEnterKeySubmitForm
        >
          <Select
            name="pathology"
            placeholder="Patologia"
            onlyOneValue
            options={data?.map((opt) => ({
              label: opt.description,
              value: opt.id,
            })) || []}
            loading={isFetching}
          />

          <Textarea name="description" placeholder="Descrição" />

          <TextEditor name="defaultProtocol" label="Protocolo padrão" />
        </FormHandler>
      </S.Patology>
    </Error>
  );
}
