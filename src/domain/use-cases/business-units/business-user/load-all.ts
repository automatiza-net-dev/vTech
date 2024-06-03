import { BusinessUser } from "./business-user"

export type LoadAllBusinessUsers = {
    loadAllUsers: (params: LoadAllBusinessUsers.Params) => Promise<LoadAllBusinessUsers.Model>
}

export namespace LoadAllBusinessUsers  {
    export type Params = {

    }

    export type Model = BusinessUser[]
}