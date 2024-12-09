import { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";

import Actions from "@/OLD/components/DailyCashier/Actions";

import moment from "moment";
import { useToast, FetcherParams, Modal, Button } from "infinity-forge";

import { dailyCasherService } from "@/OLD/services/dailyCasher.service";

import { useMe, usePermission, useSearchDailyMovements } from "@/presentation";

function CustomAction() {
  const hasDMPermission = usePermission("MOV00");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button text="+ Abrir novo caixa" onClick={() => setOpen(true)} />

      <Modal
        styles={{ padding: 30, fontSize: 14 }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <span>Não existe Movimento diário aberto. </span>

        {hasDMPermission && (
          <span>
            <Link href="/dashboard/movimentacao-diaria">Clique aqui </Link>
            para ir para a tela de movimento diário
          </span>
        )}

        {!hasDMPermission && "Solicite ao responsável que abra o movimento"}
      </Modal>
    </>
  );
}

export function useDailyCashierTableActions({
  mutate,
}: {
  mutate: (params?: FetcherParams) => void;
}) {
  const createDailyCashierPermission = usePermission("CAI01");

  const { data: userData } = useMe();
  const { data: dailyMovements } = useSearchDailyMovements({
    status: "Aberto",
  });

  const hasDailyMevements = dailyMovements && dailyMovements.length > 0;

  const { createToast } = useToast();

  const action = {
    Custom: !hasDailyMevements && CustomAction,
    title: "Abrir Caixa",
    text: "Abrir novo caixa",
    debugMode: true,
    initialDataIsTableItem: true,
    button: { text: "Salvar" },
    isStickyButtons: true,
    onSucess: async (data) => {
      const payload = {
        openingDate: moment(new Date()),
        userId: userData?.user?.id,
        dailyMovementId: dailyMovements?.[0]?.id,
        initialBalance: Number(data?.initialBalance),
      };

      try {
        await dailyCasherService.openDailyCasher(payload);

        createToast({
          status: "success",
          message: "Ação realizada com sucesso!",
        });

        mutate();
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.data.message) {
            createToast({
              status: "error",
              message: error.response?.data.message,
            });
            return;
          }
        }

        createToast({
          status: "error",
          message: "Erro ao realizar a ação.",
        });
      }
    },
    inputs: [
      [
        {
          name: "openingDate",
          InputComponent: "Input",
          label: "Caixa do dia",
          disabled: true,
          placeholder: moment(new Date()).format("DD/MM/YYYY - HH:mm"),
        },
      ],
      [
        {
          name: "userId",
          InputComponent: "Input",
          label: "Responsável",
          disabled: true,
          placeholder: userData?.user?.name,
        },
      ],
      [
        {
          name: "initialBalance",
          InputComponent: "InputCurrency",
          label: "Saldo inicial",
          placeholder: "R$ 0,00",
        },
      ],
    ],
  };

  return {
    modalStyles: { maxWidth: 1024 },
    create: createDailyCashierPermission && action,
    custom: [(props) => <Actions {...props} />],
  };
}
