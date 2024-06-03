import { ControllerRole } from "@/domain";

export function StatusRoleController(props: ControllerRole) {
    return props?.active ? "Ativo" : "Inativo"
}