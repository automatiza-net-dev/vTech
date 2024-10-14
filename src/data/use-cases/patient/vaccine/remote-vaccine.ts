import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteVaccine
  implements
    domain.DeleteVaccine,
    domain.LoadVaccineProtocols,
    domain.CreateVaccine,
    domain.CreateVaccineProtocol,
    domain.EditVaccineProtocol,
    domain.EditVaccine,
    domain.LoadVaccinesReports,
    domain.LoadAllVaccines,
    domain.LoadAllVaccineStatus
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}

  async createVaccineProtocol(params: domain.CreateVaccineProtocol.Params) {
    await this.httpClient.request({
      url: this.makeApiURL.make("vaccine-protocols"),
      method: "post",
      body: params,
    });
  }

  async createVaccine(params: domain.CreateVaccine.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("vaccines"),
      method: "post",
      body: params,
    });

    return response;
  }

  async loadAllProtocols(params: domain.LoadVaccineProtocols.Params) {
    return await this.httpClient.request({
      url: this.makeApiURL.make(`vaccine-protocols`),
      method: "get",
      body: params,
    });
  }

  async loadAllVaccines(params: domain.LoadAllVaccines.Params) {
    return await this.httpClient.request({
      url: this.makeApiURL.make(`vaccines`),
      method: "get",
      body: params,
    });
  }

  async editProtocol(params: domain.EditVaccineProtocol.Params) {
    return await this.httpClient.request({
      url: this.makeApiURL.make(`vaccine-protocols/${params.id}`),
      method: "put",
      body: params,
    });
  }

  async editVaccine(params: domain.EditVaccine.Params) {
    return await this.httpClient.request({
      url: this.makeApiURL.make(`vaccines/${params.id}`),
      method: "put",
      body: params,
    });
  }

  async deleteVaccine(params: domain.DeleteVaccine.Params) {
    return await this.httpClient.request({
      url: this.makeApiURL.make(`vaccines/${params.id}`),
      method: "delete",
    });
  }

  async loadVaccinesReport(params: domain.LoadVaccinesReport.Params) {
    return await this.httpClient.request({
      url: this.makeApiURL.make("reports/vaccine-vermifuge"),
      method: "get",
      body: params,
    });
  }

  async loadAllVaccinesStatus(params: domain.LoadAllVaccinesStatus.Params) {
    return await this.httpClient.request({
      url: this.makeApiURL.make(`vaccines/status/${params.id}`),
      method: "get",
    });
  }
}
