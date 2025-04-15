import { Modal, FormHandler, useToast, useQueryClient } from "infinity-forge";

import { Permissions } from "./permissions";
import { Departaments } from "./departaments";
import { RolesControllerSearch } from "./roles-controller-search";

import {
  RemoteAccessControls,
  RemoteControllerRole,
  RemoteUpdateDepartaments,
} from "@/data";
import { adminTypes, container } from "@/container";
import { useAccessControls } from "@/presentation";

import { IFormEditAccessControlsProps } from "./interfaces";

import * as S from "./styles";

export function FormEditAccessControls({
  modal,
  setModal,
  controllerRole,
}: IFormEditAccessControlsProps) {
  const { createToast } = useToast();
  const refetch = useQueryClient((state) => state.refetch);
  const { data, isFetching } = useAccessControls({ id: controllerRole?.id });

  return (
    <Modal
      onClose={() => setModal(false)}
      open={modal}
      styles={{ maxWidth: "900px", width: "100%" }}
    >
      <S.EditAccessControls>
        {isFetching ? (
          <></>
        ) : (
          <FormHandler
            isStickyButtons
            disableEnterKeySubmitForm
            cleanFieldsOnSubmit={false}
            button={{ text: "Salvar" }}
            onSucess={async (data) => {
              await container
                .get<RemoteControllerRole>(adminTypes.RemoteControllerRole)
                .update({
                  ...data.rolesControllerSearch,
                  profileAccessIdList: data?.profileAccessIdList?.map((item) =>
                    Number(item)
                  ),
                  externalAccess: !!data?.rolesControllerSearch?.externalAccess,
                  id: controllerRole?.id,
                  profiles: undefined,
                });

              await container
                .get<RemoteUpdateDepartaments>(
                  adminTypes.RemoteUpdateDepartaments
                )
                .update({
                  roleId: controllerRole?.id,
                  profileAccessIdList: data?.profileAccessIdList?.map((item) =>
                    Number(item)
                  ),
                });

              await container
                .get<RemoteAccessControls>(adminTypes.RemoteAccessControls)
                .update({
                  id: String(controllerRole?.id),
                  roles: data?.data,
                });

              await refetch("RemoteLoadAllControllerRoles");
              await refetch(
                ["RemoteLoadAccessControls", controllerRole?.id].toString()
              );

              createToast({
                message: "Controle editado com sucesso!",
                status: "success",
              });
              setModal(false);
            }}
            initialData={data}
          >
            <div className="row">
              <RolesControllerSearch />

              <Departaments />
            </div>

            <Permissions />
          </FormHandler>
        )}
      </S.EditAccessControls>
    </Modal>
  );
}
