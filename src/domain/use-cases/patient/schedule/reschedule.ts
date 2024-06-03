export type Reschedule = {
    reschedule: (params: Reschedule.Params) => Promise<{}>
}

export namespace Reschedule {
    export type Params = {
        id: string;
        endHour: string,
        ignoreBlocking: boolean;
        reasonId: string;
        startHour: string;
        userId: string;
        observation?: string;
    }
}