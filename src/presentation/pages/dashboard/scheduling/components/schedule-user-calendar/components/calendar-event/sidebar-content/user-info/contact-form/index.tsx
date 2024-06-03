import moment from "moment";
import {
  Error,
  FormHandler,
  Input,
  Textarea,
  useToast,
  BadRequestError,
} from "infinity-forge";

import { RemoteSchedule } from "@/data";
import { ConfirmSchedule } from "@/domain";
import { container, patientTypes } from "@/container";

import * as S from "./styles";

export function ContactForm({ event, setOpen }) {
  const { createToast } = useToast();

  async function handleOnSuccess(data: ConfirmSchedule.Params) {
    try {
      const body: ConfirmSchedule.Params = {
        ...data,
        scheduleId: event?.event.id,
        statusId: event?.event.serviceStatus?.id,
        contactDate: moment(data.contactDate).toISOString(),
      };

      await container
        .get<RemoteSchedule>(patientTypes.RemoteSchedule)
        .confirm(body);

      createToast({ message: "Contato Salvo!", status: "success" });

      //TODO rechamar a rota para recarregar o evento RemoteLoadAllSchedulesUser + os parametros corretos atuais- pegar do contexto de useScheduling igual ao da page.tsx

      setOpen(false);
      return;
    } catch (err) {
      if (err instanceof BadRequestError) {
        createToast({ message: err.error.message, status: "error" });
      }
    }
  }

  return (
    <Error name="ContactForm">
      <S.ContactForm>
        <FormHandler
          button={{ text: "Salvar Contato" }}
          onSucess={handleOnSuccess}
          initialData={{ contactDate: moment().format("YYYY-MM-DDTHH:mm") }}
        >
          <Input name="contactDate" type="datetime-local" />

          <Textarea name="observation" placeholder="Observação" />
        </FormHandler>
      </S.ContactForm>
    </Error>
  );
}
