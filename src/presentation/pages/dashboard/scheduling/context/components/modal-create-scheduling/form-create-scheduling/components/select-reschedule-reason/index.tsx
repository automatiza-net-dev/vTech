import { Select, Textarea } from "infinity-forge";

import { useLoadAllReasons } from "@/presentation";

export function SelectRescheduleReason() {

  const { data } = useLoadAllReasons("RA");

  return (
    <div className="row">
      <Select
        label="Motivo Reagendamento"
        name="reasonId"
        isGroup={false}
        isMultiple={false}
        onlyOneValue
        placeholder="Selecione o motivo Reagendamento"
        options={
          data?.map((reason) => ({ label: reason.reason, value: reason.id })) ||
          []
        }
      />

      <Textarea
        name="observation"
        label="Observações Reagendamento"
        placeholder=""
      />
    </div>
  );
}
