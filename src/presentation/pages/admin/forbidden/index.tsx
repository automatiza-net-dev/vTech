import { useAuthAdmin } from "infinity-forge"
import { useRouter } from "next/router"
import { SignInAdmin } from "../sign-in"
import { SignIn } from "@/OLD/components/Authentication/SignIn"

export function Forbidden() {
    const {roleUser} = useAuthAdmin()

    const router = useRouter()

    if(router.pathname.includes("admin") && roleUser === "user") {
        return <SignInAdmin />
    }

    return <SignIn />
}