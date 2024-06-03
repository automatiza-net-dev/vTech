export type CreateCopyRole = {
    copy: (params: CreateCopyRole.Params) => Promise<{}>
}

export namespace CreateCopyRole {
    export type Params = {
        roleId: string;
    }
}