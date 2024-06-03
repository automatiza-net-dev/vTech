export type DeleteUserController = {
    delete: (paramas: DeleteUserController.Params) => Promise<DeleteUserController.Model>
}

export namespace DeleteUserController {
    export type Params = {
        id: string;
    }

    export type Model = {

    }
}