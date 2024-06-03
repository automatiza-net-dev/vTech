export type LoadProfessionalsSchedule = {
    load: () => Promise<LoadProfessionalsSchedule.Model>
}

export namespace LoadProfessionalsSchedule {
    export type Model = {id: string, name: string, on_duty: boolean}[]
}