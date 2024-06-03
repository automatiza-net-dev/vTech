import { inject, injectable } from "inversify";

import * as domain from "infinity-forge/dist/system/domain";
import * as domainVtech from "@/domain";

import { InfraTypes } from "../infra";

@injectable()
export class AuthorizeHttpClientDecorator implements domain.HttpClient {
  constructor(
    @inject(InfraTypes.storage)
    private readonly storage: domainVtech.StorageVtech,
    @inject(InfraTypes.http) private readonly httpClient: domain.HttpClient
  ) {}

  async request(data: domain.HttpRequest) {
    const storageToken = await this.storage.get<"adminUser">("adminUser");

    const token = storageToken?.value;

    Object.assign(data, {
      headers: Object.assign(data.headers || {}, {
        Authorization: `Bearer ${token || ""}`,
        flag: "adminUser",
      }),
    });

    const httpResponse = await this.httpClient.request(data);

    return httpResponse;
  }
}
