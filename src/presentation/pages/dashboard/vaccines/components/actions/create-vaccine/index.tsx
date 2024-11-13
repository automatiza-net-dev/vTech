import { useState } from "react";

import { useQueryClient } from "react-query";
import { useLoadAllVaccinesProtocols } from "@/presentation";

import { RemoteVaccine } from "@/data";

import { EditProtocol } from "../edit-protocol";
import { VaccineForm } from "../../vaccine-form";
import { CreateProtocol } from "../create-protocol";
import { ProtocolsTable } from "../../protocols-table";
import { Modal, Button, useToast } from "infinity-forge";
import * as S from "./styles";

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

  const queryClient = useQueryClient();

  const { createToast } = useToast();
  const vaccinesProtocols = useLoadAllVaccinesProtocols({
    vaccine: vaccineId,
    fetch: open,
  });

  const createVaccine = async () => {
    try {
      if (!data?.name || data?.name === "") {
        return createToast({ message: "Nome obrigatório", status: "error" });
      }
      const response = await container
        .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
        .createVaccine(data);

      setVaccineId(response.id);

      queryClient.invalidateQueries(["LoadAllVaccineProtocols"]);
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
    <S.CreateVaccine>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setVaccineId("");
        }}
        children={
          <div className="protocol-table-box">
            <VaccineForm {...vaccineFormProps} />
            {vaccineId !== "" && (
              <div style={{ padding: "20px" }}>
                <CreateProtocol vaccineId={vaccineId} />
                <ProtocolsTable {...protocolsTableProps} />
              </div>
            )}
          </div>
        }
      />
      <Button text="Cadastrar" type="button" onClick={() => setOpen(true)} />
    </S.CreateVaccine>
  );
}
