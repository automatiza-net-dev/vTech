import { useRouter } from "next/router";
import {
  Error,
  FormHandler,
  Input,
  useToast,
  Textarea,
  InputFile,
  useAuthAdmin,
} from "infinity-forge";

import { User } from "@/domain";
import { DropdownComponentProps } from "../dropdown-item";

import * as S from "./styles";

export function VideoPhoto({ setModal }: DropdownComponentProps) {
  const { createToast } = useToast();

  const router = useRouter();
  const userId = useAuthAdmin().user.id;

  const patientId = router.query.id as string;

  return (
    <Error name="VideoPhoto">
      <S.VideoPhoto>
        <FormHandler
          button={{ text: "Salvar" }}
          onSucess={async (data) => {
            const payload = {
              ...data,
              tag: patientId,
              technicianId: userId,
            };

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
              message: "Video/Foto criada com sucesso!",
              status: "success",
            });

            setModal && setModal(false);
          }}
          disableEnterKeySubmitForm
        >
          <div className="row">
            <Input name="title" placeholder="Título" />
          </div>

          <Textarea name="observation" placeholder="Observações" />

          <InputFile name="photos" />
        </FormHandler>
      </S.VideoPhoto>
    </Error>
  );
}
