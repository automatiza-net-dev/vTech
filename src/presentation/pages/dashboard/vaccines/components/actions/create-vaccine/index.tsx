import { useState } from "react";

import { useLoadAllVaccinesProtocols } from "@/presentation";

import { RemoteVaccine } from "@/data";

import { EditProtocol } from "../edit-protocol";
import { VaccineForm } from "../../vaccine-form";
import { CreateProtocol } from "../create-protocol";
import { ProtocolsTable } from "../../protocols-table";
import { Modal, Button, useToast } from "infinity-forge";

import { TypesAutomatiza, container } from "@/container";

export function CreateVaccine({ type }) {
  const [open, setOpen] = useState(false);
  const [vaccineId, setVaccineId] = useState("");
  const [data, setData] = useState({
    name: "",
    description: "",
    subgroupId: "",
    type,
  });

  const { createToast } = useToast();
  const vaccinesProtocols = useLoadAllVaccinesProtocols({
    vaccine: vaccineId,
    fetch: open,
  });

  const createVaccine = async () => {
    try {
      const response = await container
        .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
        .createVaccine(data);

      setVaccineId(response.id);
    } catch (err) {
      return createToast({
        message: "Verificar retorno de erros",
        status: "error",
      });
    }
    return createToast({
      message: `${
        type === "vaccine" ? "Vacina criada" : "Vermifugo criado"
      } com sucesso!`,
      status: "success",
    });
  };

  const vaccineFormProps = {
    data,
    setData,
    submit: createVaccine,
    created: vaccineId !== "",
    edit: false,
    type,
  };

  const protocolsTableProps = {
    data: vaccinesProtocols.data,
    actions: [EditProtocol],
    type: type === "vaccine" ? "Vacina" : "Vermifugo",
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setVaccineId("");
        }}
        children={
          <>
            <VaccineForm {...vaccineFormProps} />
            {vaccineId !== "" && (
              <>
                <CreateProtocol vaccineId={vaccineId} />
                <ProtocolsTable {...protocolsTableProps} />
              </>
            )}
          </>
        }
      />
      <Button text="Cadastrar" type="button" onClick={() => setOpen(true)} />
    </>
  );
}
