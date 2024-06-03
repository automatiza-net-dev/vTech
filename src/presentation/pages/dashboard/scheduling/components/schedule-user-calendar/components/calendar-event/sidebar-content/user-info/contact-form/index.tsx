import moment from "moment";
import { Error, FormHandler, Input, Textarea, useToast, BadRequestError} from "infinity-forge";

import { RemoteSchedule } from "@/data";
import {ConfirmSchedule } from "@/domain";
import { container, patientTypes } from "@/container";

import * as S from "./styles";

export function ContactForm({ event, setOpen }) {
  const { toast } = useToast();

  async function handleOnSuccess(data: ConfirmSchedule.Params) {
    try {
      const body: ConfirmSchedule.Params = {
        ...data,
        scheduleId: event?.event.id,
        statusId: event?.event.serviceStatus?.id,
        contactDate: moment(data.contactDate).toISOString(),
      };

      await container.get<RemoteSchedule>(patientTypes.RemoteSchedule).confirm(body);

      toast.success("Contato Salvo!", { autoClose: 4000, position: "top-right" })

      //TODO rechamar a rota para recarregar o evento RemoteLoadAllSchedulesUser + os parametros corretos atuais- pegar do contexto de useScheduling igual ao da page.tsx

      setOpen(false);
      return;
    } catch (err) {
      if (err instanceof BadRequestError) {
        toast.error(err.error.message, { autoClose: 4000, position: "top-right" })
      }
    }

    return;
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
