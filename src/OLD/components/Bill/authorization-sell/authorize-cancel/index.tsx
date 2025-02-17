import { FormHandler, Input } from "infinity-forge";



export function AuthorizeCancel() {



    return <FormHandler>
        <Input name="email" />
        <Input name="password" />
    </FormHandler>
}