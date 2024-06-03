import {
  Modal,
  useAccessControls,
  useUpdateAccessControls,
} from "@/presentation";

import { FormHandler } from "infinity-forge";

import { Permissions } from "./permissions";
import { Departaments } from "./departaments";
import { RolesControllerSearch } from "./roles-controller-search";

import { IFormEditAccessControlsProps } from "./interfaces";

import * as S from "./styles";

export function FormEditAccessControls({
  modal,
  setModal,
  controllerRole,
}: IFormEditAccessControlsProps) {
  const { data } = useAccessControls({ id: controllerRole?.id });
  const { mutateAsync } = useUpdateAccessControls({
    roleId: controllerRole?.id,
  });

  const profileAccessIdList = data?.departaments.map((departament) => {
    const profileIsActive = !!data?.rolesControllerSearch?.profiles?.find(
      (item) => item?.id === departament?.idPerfil
    );

    return {
      id: departament?.idPerfil,
      value: profileIsActive,
    };
  });

  const initialData = {
    profileAccessIdList,
    data: data?.rolesPermissions,
    rolesControllerSearch: data?.rolesControllerSearch,
  };

  return (
    <>
      {modal && (
        <Modal setModal={setModal} stateModal={modal} maxwidth={"900px"}>
          <S.EditAccessControls>
            <FormHandler
              cleanFieldsOnSubmit={false}
              button={{ text: "Salvar" }}
              onSucess={async (data) => {
                await mutateAsync(data);
                setModal(false);
              }}
              initialData={initialData}
            >
              <div className="row">
                <RolesControllerSearch />

                {data?.departaments && (
                  <Departaments departaments={data?.departaments} />
                )}
              </div>

              <Permissions />
            </FormHandler>
          </S.EditAccessControls>
        </Modal>
      )}
    </>
  );
}
