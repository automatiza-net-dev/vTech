import { Dispatch, SetStateAction, useState } from "react";

import moment from "moment";
import {
  Modal,
  useToast,
  FormHandler,
  useAuthAdmin,
  LoaderCircle,
  InputCurrency,
  Input,
} from "infinity-forge";

import { RemoteMeta } from "@/data";
import { useLoadGoal } from "@/presentation";
import { CreateGoal, LoadGoal, User } from "@/domain";
import { TypesAutomatiza, container } from "@/container";

import * as S from "./styles";

export function Goals() {
  const list = Array.from({ length: 12 }).map((_, index) => {
    return moment().add("month", 1).subtract("month", index).format("MM/YYYY");
  });

  return (
    <>
      <h3 className="font-20-bold">Últimos meses:</h3>

      <S.Goals>
        {list.map((period) => (
          <CardGoal key={period} period={period} />
        ))}
      </S.Goals>

      <p className="font-14-bold" style={{ color: "red" }}>
        Os itens em vermelho são meses que ainda não tem metas
      </p>
    </>
  );
}

function CardGoal({ period }: { period: LoadGoal.Params["period"] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal
        styles={{ maxWidth: "512px", width: "100%" }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <FormGoal setOpen={setOpen} period={period} />
      </Modal>

      <div className="item" onClick={() => setOpen(true)}>
        {period}
      </div>
    </>
  );
}

function FormGoal({
  period,
  setOpen,
}: {
  period: LoadGoal.Params["period"];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { GetUser } = useAuthAdmin();
  const { data, isFetching } = useLoadGoal(period);

  const { createToast } = useToast();

  const user = GetUser<User>();

  if (isFetching) {
    return <LoaderCircle size={30} />;
  }

  if (!data || data.length === 0) {
    return <>Nada cadastrado neste periodo</>;
  }

  const metas = data[0].metas;

  return (
    <FormHandler
      initialData={
        {
          items: metas.map((meta) => ({
            period,
            metaId: String(meta.id),
            unitMetaId: meta.unitMetaId,
            value: meta.value || "0",
            businessUnitId: String(user.unit.id),
          })),
        } as CreateGoal.Params
      }
      isStickyButtons
      button={{ text: "Salvar" }}
      onSucess={async (data) => {
        await container
          .get<RemoteMeta>(TypesAutomatiza.RemoteMeta)
          .create(data);

        createToast({ message: "Meta criada com sucesso", status: "success" });

        setOpen && setOpen(false);
      }}
    >
      {metas.map((meta, index) => {
        const name = `items[${index}].value`;

        if (meta.type === "R$") {
          return (
            <div key={meta.id}>
              <InputCurrency name={name} label={meta.description} />
            </div>
          );
        }

        return (
          <div key={meta.id}>
            <Input type="number" name={name} label={meta.description} />
          </div>
        );
      })}
    </FormHandler>
  );
}
