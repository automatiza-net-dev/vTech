import { List } from "infinity-forge"
import { EntrieReport } from "./entrie-report"

export type LoadAllEntriesReports = {
    loadAll: (params: LoadAllEntriesReports.Params) => Promise<LoadAllEntriesReports.Model>
}

export namespace LoadAllEntriesReports {
    export type Params = {

    }

    export type Model = List<EntrieReport>
}