import { Container } from "inversify";

import { InfraTypes } from "./types";
import { makeApiURL } from "./make-api-url";
import { AuthorizeDashboardHttpClientDecorator } from "../decorators";
import { AxiosHttpClient } from "./axios-http-client";
import { CookieStorageAdapter } from "./cookies";

const infraContainer = new Container({ autoBindInjectable: true, defaultScope: "Singleton" });

infraContainer.bind(InfraTypes.http).to(AxiosHttpClient);

infraContainer.bind(InfraTypes.storage).to(CookieStorageAdapter);

infraContainer
  .bind(InfraTypes.authorizeAdminHttp)
  .to(AuthorizeDashboardHttpClientDecorator);

  infraContainer
  .bind(InfraTypes.authorizeDashboardHttp)
  .to(AuthorizeDashboardHttpClientDecorator);

infraContainer.bind(InfraTypes.makeApiURL).to(makeApiURL);

export { infraContainer };
