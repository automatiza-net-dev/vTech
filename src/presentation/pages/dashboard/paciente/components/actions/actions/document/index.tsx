import { useRouter } from "next/router";
import { Error, FormHandler, Select, TextEditor, useToast } from "infinity-forge";

import { DropdownComponentProps } from "../dropdown-item";

import * as S from "./styles";

export function Document({ setModal }: DropdownComponentProps) {
  const router = useRouter();

  const { createToast} = useToast();

  return (
    <Error name="Document">
      <S.Document>
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

            createToast({ message: "Documento criado com sucesso!", status: "success" })

            setModal &&  setModal(false);
          }}
          disableEnterKeySubmitForm
        >
          <div className="row">
            <Select name="document" placeholder="Documento" options={[]} />
          </div>

          <TextEditor name="editor" />
        </FormHandler>
      </S.Document>
    </Error>
  );
}
