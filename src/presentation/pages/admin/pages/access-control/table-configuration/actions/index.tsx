import { ControllerRole } from "@/domain";

import { Edit } from "./edit";
import { Copy } from "./copy";
import { Delete } from "./delete";

export function ActionsListAccessControls(props: ControllerRole) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      <Edit {...props} />

      <Copy {...props} />

      <Delete {...props} />
    </div>
  );
}
