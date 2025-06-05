import { useState } from "react";

import {
  api,
  Input,
  Modal,
  Button,
  Select,
  useToast,
  InputMask,
  FormHandler,
  removeDigits,
  InputPassword,
  validatePhone,
} from "infinity-forge";
import * as yup from "yup";

import { PermissionItem, useConfigurationsSystem } from "@/presentation";
import { useQuery } from "infinity-forge";

export function CreateCollaborator({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);

  const { createToast } = useToast();

  const {id, name} = useConfigurationsSystem()

  const { isFetching, data } = useQuery({
    queryKey: ["Roles"],
    queryFn: async () => {
      const response = await api({ url: "roles", method: "get" });

      return response;
    },
    enabled: !!open,
  });

  return (
    <>
      <PermissionItem hash="COL01">
        <Button text="Cadastrar" onClick={() => setOpen(true)} type="button" />
      </PermissionItem>

      <Modal open={open} onClose={() => setOpen(false)}>
        <FormHandler
          isStickyButtons
          button={{ text: "Cadastrar" }}
          schema={{
            phone: yup
              .string()
              .required("Campo requerido")
              .test("Validar telefone", "Telefone inválido", (phone) =>
                validatePhone({ phoneNumber: phone })
              ),
          }}
          onSucess={async (data) => {
            await api({
              url: "business-units/create-collaborator",
              method: "post",
              body: {
                ...data, 
                systemId: id,
                phone: removeDigits(data.phone),
                systemName: name,
              },
            });

            onSuccess && onSuccess()


            createToast({
              status: "success",
              message: "Colaborador cadastrado com sucesso!",
            });

            setOpen(false)
          }}
        >
          <div className="row">
            <Input name="name" label="Nome" />

            <Input name="email" label="Email" />
          </div>

          <Select
            label="Cargo"
            name="roleId"
            loading={isFetching}
            options={
              data?.map((item) => ({ label: item.name, value: item.id })) || []
            }
            onlyOneValue
          />

          <div className="row">
            <InputPassword name="password" label="Senha" />

            <InputPassword
              name="password_confirmation"
              label="Confirme a senha"
            />
          </div>

          <InputMask name="phone" label="Telefone" mask="(__) _ ____-____" />
        </FormHandler>
      </Modal>
    </>
  );
}
