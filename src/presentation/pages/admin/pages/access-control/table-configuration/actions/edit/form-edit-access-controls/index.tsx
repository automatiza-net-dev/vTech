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
 
  setModal,
  controllerRole,
}: IFormEditAccessControlsProps) {
  const { createToast } = useToast();
  const refetch = useQueryClient((state) => state.refetch);
  const { data, isFetching } = useAccessControls({ id: controllerRole?.id });

  return (
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
                  ...data,
                  id: controllerRole?.id,
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
  
  );
}
