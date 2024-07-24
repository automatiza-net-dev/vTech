import { useRouter } from "next/router";
import {
  Error,
  FormHandler,
  Input,
  TextEditor,
  useToast,
} from "infinity-forge";

import { DropdownComponentProps } from "../dropdown-item";

import * as S from "./styles";

export function Death({ setModal }: DropdownComponentProps) {
  const router = useRouter();

  const { createToast } = useToast();

  return (
    <Error name="Death">
      <S.Death>
        <FormHandler
          button={{ text: "Salvar" }}
          onSucess={async (data) => {
            // await container
            //   .get<RemoteAttendances>(TypesAutomatiza.RemoteAttendances)
            //   .open({
            //     ...data,
            //     patientId: router.query.id,
            //     scheduleServiceId: data.scheduleServiceId
            //       ? data.scheduleServiceId[0]
            //       : "",
            //   });

            createToast({
              message: "Óbito criado com sucesso!",
              status: "success",
            });

            setModal && setModal(false);
          }}
          disableEnterKeySubmitForm
        >
          <div className="row">
            <Input name="holder" placeholder="Veterinário responsável" />
          </div>

          <Input type="date" name="date" placeholder="Data" />

          <TextEditor name="report" placeholder="Relatório do óbito" />
        </FormHandler>
      </S.Death>
    </Error>
  );
}
