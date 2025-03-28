import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteAttendances
  implements
    domain.OpenAttendace,
    domain.UpdateAttendace,
    domain.DeleteAttendace
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}

  async open(params: domain.OpenAttendace.Params & { typeSystem?: "Vet" }) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(
        params.typeSystem === "Vet"
          ? `attendances/open`
          : "n-timeline/evaluation"
      ),
      method: "post",
      body: params,
      headers: {
        "Content-Type": "multipart/form-data; boundary=something",
      },
    });

    return response as domain.OpenAttendace.Model;
  }

  async update(params: domain.UpdateAttendace.Params & { typeSystem?: "Vet" }) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(
      params.typeSystem === "Vet"
          ? `attendances/update/${params.id}`
          : `n-timeline/evaluation/${params.id}`
      ),
      method: "put",
      body: params,
      headers: {
        "Content-Type": "multipart/form-data; boundary=something",
      },
    });

    return response as domain.UpdateAttendace.Model;
  }

  async delete(params: domain.DeleteAttendace.Params) {
    await this.httpClient.request({
      url: this.makeApiURL.make(`n-timeline/${params.id}`),
      method: "delete",
    });

    return {};
  }
}
