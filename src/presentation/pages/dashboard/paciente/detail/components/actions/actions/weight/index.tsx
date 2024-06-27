import { useRouter } from "next/router";
import {
  Error,
  Input,
  Textarea,
  useToast,
  FormHandler,
  useAuthAdmin,
} from "infinity-forge";
import { useQueryClient } from "react-query";

import { User } from "@/domain";
import { RemotePatient } from "@/data";
import { TypesAutomatiza, container } from "@/container";
import { DropdownComponentProps } from "../dropdown-item";

import * as S from "./styles";

export function Weight(props: DropdownComponentProps) {
  const router = useRouter();

  const { GetUser } = useAuthAdmin();
  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const user = GetUser<User>();

  const patientId = router.query.id as string;

  return (
    <Error name="Weight">
      <S.Weight>
        <FormHandler
          isStickyButtons
          initialData={{
            weight: props.timeline_info?.weight,
            observation: props.timeline_info?.observation,
          }}
          button={props.timeline_info?.weight ? undefined : { text: "Salvar" }}
          onSucess={async (data) => {
            await container
              .get<RemotePatient>(TypesAutomatiza.RemotePatient)
              .changeWeight({
                ...data,
                weight: String(data.weight || ""),
                realizedAt: new Date(),
                tag: patientId,
                technicianId: user.user.id,
              });

            await queryClient.invalidateQueries({
              queryKey: ["RemotePatient", patientId],
            });

            await queryClient.invalidateQueries({
              queryKey: ["LastUpdates", patientId],
            });

            createToast({
              message: "Peso criado com sucesso!",
              status: "success",
            });

            props.setModal && props.setModal(false);
          }}
          disableEnterKeySubmitForm
        >
          <div className="row">
            <Input
              name="weight"
              readOnly={!!props.timeline_info?.weight}
              type="number"
              placeholder="Peso (Kg)"
            />
          </div>

          <Textarea
            name="observation"
            readOnly={!!props.timeline_info?.weight}
            placeholder="Observações"
          />
        </FormHandler>
      </S.Weight>
    </Error>
  );
}
