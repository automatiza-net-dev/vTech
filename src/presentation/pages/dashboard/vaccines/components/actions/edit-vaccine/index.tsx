import { useState, useEffect } from "react";

import { VaccineProtocol } from "@/domain";

import { RemoteVaccine } from "@/data";

import { useQueryClient } from "react-query";
import { useLoadAllVaccinesProtocols } from "@/presentation";

import { VaccineForm } from "../../vaccine-form";
import { CreateProtocol } from "../create-protocol";
import { ProtocolsTable } from "../../protocols-table";
import { Modal, Tooltip, useToast } from "infinity-forge";

import { TypesAutomatiza, container } from "@/container";

import * as S from "./styles";
import { EditProtocol } from "../edit-protocol";

export function EditVaccine(props: VaccineProtocol) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    id: props?.vaccine?.id,
    name: props?.vaccine?.name,
    description: props?.vaccine?.description,
    subgroupId: props?.vaccine?.subgroupId,
    type: props?.vaccine?.type,
    active: props?.vaccine?.active,
  });

  const { createToast } = useToast();
  const queryClient = useQueryClient();

  const vaccinesProtocols = useLoadAllVaccinesProtocols({
    vaccine: props?.vaccine?.id,
    fetch: open,
  });

  const updateVaccine = async () => {
    if (!data?.name || data?.name === "") {
      return createToast({ message: "nome obrigatório", status: "error" })
    }

    try {
      await container
        .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
        .editVaccine(data);

      setOpen(false);

      queryClient.invalidateQueries(["LoadAllVaccineProtocols"]);
    } catch (err: any) {
      if (err?.error) {
        return createToast({ message: err?.error?.message, status: "error" });
      }
    }
    return createToast({
      message: "Vacina atualizada com sucesso!",
      status: "success",
    });
  };

  const protocolFormProps = {
    data,
    setData,
    submit: () => updateVaccine(),
    created: false,
    edit: true,
    type: props?.vaccine?.type,
  };

  const protocolsTableProps = {
    data: vaccinesProtocols.data,
    actions: [EditProtocol],
    type: props?.vaccine?.type,
  };

  useEffect(() => {
    setData({
      id: props?.vaccine?.id,
      name: props?.vaccine?.name,
      description: props?.vaccine?.description,
      subgroupId: props?.vaccine?.subgroupId,
      type: props?.vaccine?.type,
      active: props?.vaccine?.active,
    });
  }, [open]);

  return (
    <S.EditVaccine>
      <Tooltip
        idTooltip="EditVaccine"
        content={
          props?.vaccine?.type === "vaccine"
            ? "Editar vacina"
            : "Editar vermífugo"
        }
        trigger={
          <button
            onClick={() => {
              setOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
            >
              <path
                d="M2.27614 9.59326L9.03753 2.83183L8.09473 1.88901L1.33333 8.65046V9.59326H2.27614ZM2.82843 10.9266H0V8.09813L7.62333 0.474801C7.88373 0.214454 8.3058 0.214454 8.56613 0.474801L10.4518 2.36042C10.7121 2.62077 10.7121 3.04288 10.4518 3.30323L2.82843 10.9266ZM0 12.2599H12V13.5933H0V12.2599Z"
                fill="#828282"
              />
            </svg>
            <Modal
              styles={{ width: "980px", padding: "20px" }}
              children={
                <>
                  <VaccineForm {...protocolFormProps} />
                  <>
                    <CreateProtocol vaccineId={props?.vaccine?.id} />
                    <div style={{ width: "900px" }}>
                      <ProtocolsTable {...protocolsTableProps} />
                    </div>
                  </>
                </>
              }
              open={open}
              onClose={() => setOpen(false)}
            />
          </button>
        }
      />
    </S.EditVaccine>
  );
}
