import { useRouter } from "next/router";
import {
  Error,
  Input,
  Textarea,
  useToast,
  FormHandler,
} from "infinity-forge";

import { DropdownComponentProps } from "../dropdown-item";

import * as S from "./styles";

export function Weight({ setModal }: DropdownComponentProps) {
  const router = useRouter();

  const { toast } = useToast();

  return (
    <Error name="Weight">
      <S.Weight>
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

            toast.success("Óbito criado com sucesso!", {
              autoClose: 4000,
              position: "top-right",
            });

            setModal(false);
          }}
          disableEnterKeySubmitForm
        >
          <div className="row">
            <Input name="weight" placeholder="Peso (Kg)" />
          </div>

          <Textarea name="obervation" placeholder="Observações" />
        </FormHandler>
      </S.Weight>
    </Error>
  );
}
