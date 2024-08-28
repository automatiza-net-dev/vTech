import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteAttachments implements domain.AddAttachment {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}

  async addAttachment(params: domain.AddAttachment.Params) {
    await this.httpClient.request({
      url: this.makeApiURL.make(
        `n-timeline/photos/attachments/${params.attachmentId}`
      ),
      method: "post",
      body: params,
      headers: {
        "Content-Type": "multipart/form-data; boundary=something",
      },
    });
  }
}
