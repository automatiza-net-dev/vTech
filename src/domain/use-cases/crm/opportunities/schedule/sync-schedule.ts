export type SyncSchedule = {
    sync: (params: SyncSchedule.Params) => Promise<{}>
}

export namespace SyncSchedule {
    export type Params = {
        scheduleId: string;
        opportunityId: number;
    }
}