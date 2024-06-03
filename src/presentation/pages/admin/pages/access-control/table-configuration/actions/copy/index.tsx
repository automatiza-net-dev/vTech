import { ControllerRole } from "@/domain";
import { ButtonCopy, useCopyRole } from "@/presentation";

export function Copy(props: ControllerRole) {
  const { mutateAsync } = useCopyRole({ roleId: String(props.id) });

  return <ButtonCopy onClick={() => mutateAsync()} />;
}
