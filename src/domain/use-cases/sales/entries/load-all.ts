import { List } from "infinity-forge";

import { Entrie } from "./entrie";

export type LoadAllEntries = {
    loadAll: (params: LoadAllEntries.Params) => Promise<LoadAllEntries.Model>
}

export namespace LoadAllEntries {
    export type Params = {
        date?: string;
    }

    export type Model = List<Entrie>
}
