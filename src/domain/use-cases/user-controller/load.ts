import { UserController } from "./user-controller"

export type LoadUserControllers = {
    load: () => Promise<LoadUserControllers.Model>
}

export namespace LoadUserControllers {
    export type Model = UserController[]
}