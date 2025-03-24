import { User } from "@/domain";
import { useAuthAdmin } from "infinity-forge";

export function useSystem() {
    const { user } = useAuthAdmin();

    const userAdmin: User = user;

    return userAdmin
}