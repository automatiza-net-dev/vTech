import { inject, injectable } from "inversify";

import * as infra from "@/infra";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import axios from "axios";

import * as domain from "@/domain";

@injectable()
export class RemoteDre implements domain.LoadDreReport {
  constructor(
    @inject(InfraTypes.storage) private readonly storage: infra.Storage,
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}
  async loadDreReport(params: domain.LoadDreReport.Params) {
    const storageToken = await this.storage.get("user");

    const response = await axios(
      process.env.NEXT_PUBLIC_API +
        `/dre/spreadsheet/${params.unit}?competence=${params.competence}`,
      {
        method: "GET",
        responseType: "blob",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
          "X-System": process.env.clientName as string,
          Authorization: `Bearer ${storageToken?.value || ""}`,
        },
      }
    );

    // TODO verificar tipagem axios

    return response;
  }
}
