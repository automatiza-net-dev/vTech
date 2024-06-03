import { ControllerRole } from "@/domain";

export function ExternalAccessRoleController(props: ControllerRole) {
    return props?.external_access ? "Sim" : "Não"
}