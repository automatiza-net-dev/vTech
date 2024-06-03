import { useRouter } from "next/router";
import {
  Error,
  Input,
  useToast,
  Textarea,
  TextEditor,
  FormHandler,
} from "infinity-forge";

import { RemoteAttendances } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import { DropdownComponentProps } from "../dropdown-item";
import { ButtonNewBudget, SelectTypeService } from "./components";

import * as S from "./styles";

export function Avaliation({ setModal }: DropdownComponentProps) {
  const router = useRouter();

  const { toast } = useToast();

  return (
    <Error name="Avaliation">
      <S.Avaliation>
        <FormHandler
          button={{ text: "Salvar" }}
          onSucess={async (data) => {
            await container
              .get<RemoteAttendances>(TypesAutomatiza.RemoteAttendances)
              .open({
                ...data,
                patientId: router.query.id,
                scheduleServiceId: data.scheduleServiceId
                  ? data.scheduleServiceId[0]
                  : "",
              });

            toast.success("Atendimento criado com sucesso!", {
              autoClose: 4000,
              position: "top-right",
            });

            setModal(false);
          }}
          disableEnterKeySubmitForm
        >
          <div className="row">
            <SelectTypeService />

            <Input name="resume" placeholder="Resumo" />
          </div>

          <Textarea
            name="internalObservation"
            placeholder="Observações internas"
          />

          <TextEditor name="protocol" />

          <div className="button_new_budget">
            <ButtonNewBudget />
          </div>
        </FormHandler>
      </S.Avaliation>
    </Error>
  );
}
