import { useState } from "react";
import { useQueryClient } from "infinity-forge";

import { RemoteVaccine } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import { Button, Modal, useToast } from "infinity-forge";
import { ProtocolForm } from "../../protocol-form";

export function CreateProtocol({ vaccineId }: { vaccineId: string }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    name: "",
    vaccineId,
    specieId: "",
    doses: 0,
    interval: 0,
  });

  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const createVaccineProtocol = async () => {
    try {
      await container
        .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
        .createVaccineProtocol(data);
    } catch (err) {
      return createToast({
        message: "Verificar retorno de erros",
        status: "error",
      });
    }
    queryClient.invalidateQueries({
      queryKey: ["LoadAllVaccineProtocols"],
    });
    setOpen(false);
    return createToast({
      message: "Vacina criada com sucesso!",
      status: "success",
    });
  };

  const protocolFormProps = {
    data,
    setData,
    submit: createVaccineProtocol,
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        children={<ProtocolForm {...protocolFormProps} />}
      />
      <Button text="Adicionar protocolo" onClick={() => setOpen(true)} />
    </>
  );
}
