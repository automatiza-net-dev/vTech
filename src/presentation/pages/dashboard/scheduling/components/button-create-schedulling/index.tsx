import { PermissionItem, useScheduling } from "@/presentation";
import { Button } from "infinity-forge";

export function ButtonCreateSchedulling() {
  const setModalPatients = useScheduling((state) => state.setModalPatients);

  // variant="outlined"

  return (
    <PermissionItem hash="AGE01">
      <Button
        text="Agenda horário alternativo"
        type="button"
        className="active"
        onClick={() =>
          setModalPatients({
            date: new Date(),
            scheduleUser: undefined,
            type: "create",
          })
        }
      />
    </PermissionItem>
  );
}
