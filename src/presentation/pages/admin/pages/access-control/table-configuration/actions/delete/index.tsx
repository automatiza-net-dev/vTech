import { ControllerRole } from "@/domain";
import { ButtonDelete, useDeleteControllerRole } from "@/presentation";

export function Delete(props: ControllerRole) {
  const { mutateAsync } = useDeleteControllerRole({
    id: String(props.id),
  });

  return (
    <ButtonDelete onClick={() => mutateAsync()} />
  );
}
