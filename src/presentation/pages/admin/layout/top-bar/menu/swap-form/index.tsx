import { useRouter } from "next/router";

import { FormHandler, InputRadio, Error, useAuthAdmin } from "infinity-forge";

import { Storage } from "@/infra";
import { RemoteBusinessUnits } from "@/data";
import { InfraTypes, adminTypes, container } from "@/container";
import { useLoadUsersController } from "@/presentation";

import * as S from "./styles";

export function SwapForm() {
  const { user } = useAuthAdmin();
  const { data } = useLoadUsersController();

  const userClinicas =
    data && data.length > 0
      ? data?.find((u) => {
          return u?.id === user?.user?.id;
        })?.units
      : [];

  const router = useRouter();

  async function onSucess(data) {
    await container
      .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
      .swap({ unitId: data.id });

    router.push("/dashboard");
  }

  return (
    <Error name="swap-form">
      <S.SwapForm>
        <FormHandler button={{ text: "Trocar" }} onSucess={onSucess}>
          <h4>Trocar unidade</h4>

          <InputRadio
            name="id"
            options={
              userClinicas?.map((item) => ({
                value: item.id,
                label: item.identification || "",
              })) || []
            }
          />
        </FormHandler>
      </S.SwapForm>
    </Error>
  );
}
