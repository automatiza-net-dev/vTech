import { useRouter } from "next/router";
import {
  Error,
  FormHandler,
  Input,
  useToast,
  Textarea,
} from "infinity-forge";

import { DropdownComponentProps } from "../dropdown-item";

import * as S from "./styles";

export function VideoPhoto({ setModal }: DropdownComponentProps) {
  const { toast } = useToast();

  return (
    <Error name="VideoPhoto">
      <S.VideoPhoto>
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

            toast.success("Video/Foto criada com sucesso!", {
              autoClose: 4000,
              position: "top-right",
            });

            setModal(false);
          }}
          disableEnterKeySubmitForm
        >
          <div className="row">
            <Input name="title" placeholder="Título" />
          </div>

          <Textarea name="observation" placeholder="Observações" />
        </FormHandler>
      </S.VideoPhoto>
    </Error>
  );
}
