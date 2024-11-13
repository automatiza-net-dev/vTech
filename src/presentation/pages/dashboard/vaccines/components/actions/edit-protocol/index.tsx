import { useState, useEffect } from "react";

import { VaccineProtocol } from "@/domain";

import { RemoteVaccine } from "@/data";

import { useQueryClient } from "react-query";

import { ProtocolForm } from "../../protocol-form";
import { Modal, Tooltip, useToast } from "infinity-forge";

import { TypesAutomatiza, container } from "@/container";

import * as S from "./styles";

export function EditProtocol(props: VaccineProtocol) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  const { createToast } = useToast();

  const queryClient = useQueryClient();

  const updateProtocol = async () => {
    try {
      const response = await container
        .get<RemoteVaccine>(TypesAutomatiza.RemoteVaccine)
        .editProtocol(data);

      setData({
        id: props.id,
        vaccineId: props?.vaccine?.id,
        specieId: props?.specie?.id,
        name: props?.name,
        doses: props?.doses,
        interval: props?.interval,
        active: props?.active,
        expirationDays: props?.expirationDays,
      });
    } catch (err: any) {
      if (err?.error) {
        return createToast({ message: err?.error?.message, status: "error" });
      }
    }
    setOpen(false);

    queryClient.invalidateQueries(["LoadAllVaccineProtocols"]);

    return createToast({
      message: "Protocolo atualizado com sucesso!",
      status: "success",
    });
  };

  const protocolFormProps = {
    data,
    setData,
    submit: () => updateProtocol(),
  };

  useEffect(() => {
    setData({
      id: props.id,
      vaccineId: props?.vaccine?.id,
      specieId: props?.specie?.id,
      name: props?.name,
      doses: props?.doses,
      interval: props?.interval,
      active: props?.active,
      expirationDays: props?.expirationDays,
    });
  }, [open]);

  return (
    <S.EditProtocol>
      <Tooltip
        idTooltip="EditProtocol"
        content="Editar Protocolo"
        trigger={
          <button onClick={() => setOpen(true)}>
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
              children={
                <>
                  <ProtocolForm {...protocolFormProps} />
                </>
              }
              open={open}
              onClose={() => setOpen(false)}
            />
          </button>
        }
      />
    </S.EditProtocol>
  );
}
