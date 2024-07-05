import { useRouter } from "next/router";

import { FormHandler, InputRadio, Error, useAuthAdmin } from "infinity-forge";

import { Storage } from "@/infra";
import { RemoteBusinessUnits } from "@/data";
import { InfraTypes, adminTypes, container } from "@/container";
import {  useLoadUsersController } from "@/presentation";

import * as S from "./styles";
import { User } from "@/domain";

export function SwapForm() {
  const { GetUser } = useAuthAdmin();
  const { data } = useLoadUsersController();

  const user = GetUser<User>();

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

    const adminUserToken = await container
      .get<Storage>(InfraTypes.storage)
      .get("adminUser");

    await container
      .get<Storage>(InfraTypes.storage)
      .set("user", { value: adminUserToken?.value || "" });

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
