
import { FormHandler, Input, InputMask, useQueryClient, useToast } from "infinity-forge";

import { UserController } from "@/domain";
import { RemoteUserController } from "@/data";
import { container, adminTypes } from "@/container";
import { Modal } from "@/presentation";

import { SelectRole } from "./select-role-id";
import { InputAddUnit } from "./input-add-unit";

import * as S from "./styles";

export function FormUserController({
  modal,
  setModal,
  userController,
}: {
  modal: boolean;
  userController?: UserController;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { createToast } = useToast();
  const refetch = useQueryClient(s => s.refetch);

  const id = userController?.id;

  async function onSucess(data) {
    if (id) {
      await container
        .get<RemoteUserController>(adminTypes.RemoteUserController)
        .update(data);
    } else {
      await container
        .get<RemoteUserController>(adminTypes.RemoteUserController)
        .create(data);
    }

    refetch("RemoteLoadUserControllers");

    createToast({
      message: `Colaborador ${id ? "atualizado" : "cadastrado"} com sucesso!`,
      status: "success",
    });

    setModal(false);
  }

  return (
    <>
      {modal && (
        <Modal
          setModal={setModal}
          stateModal={modal}
          maxwidth={"900px"}
          disableOverflow
        >
          <S.FormUserController>
            <FormHandler
              isStickyButtons
              initialData={{
                ...userController,
                roleId: String(userController?.roleId || ""),
                units: userController?.units?.map((unit) => unit.id),
              }}
              button={{ text: id ? "Editar" : "Cadastrar" }}
              onSucess={onSucess}
            >
              <div className="row">
                <Input name="name" label="Nome" />
                <Input name="email" type="email" label="Email" />
              </div>

              <div className="row">
                <InputMask name="document" label="Cpf" mask="___.___.___-__" />

                {!userController && <Input name="password" label="Senha" />}

                <SelectRole />
              </div>

              <InputAddUnit />
            </FormHandler>
          </S.FormUserController>
        </Modal>
      )}
    </>
  );
}
