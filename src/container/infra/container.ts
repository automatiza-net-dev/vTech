import { Container } from "inversify";

import { AxiosHttpClient, CookieStorageAdapter } from "infinity-forge";
import { InfraTypes } from "./types";
import { makeApiURL } from "./make-api-url";
import { AuthorizeHttpClientDecorator, AuthorizeDashboardHttpClientDecorator } from "../decorators";

const infraContainer = new Container({ autoBindInjectable: true, defaultScope: "Singleton" });

infraContainer.bind(InfraTypes.http).to(AxiosHttpClient);

infraContainer.bind(InfraTypes.storage).to(CookieStorageAdapter);

infraContainer
  .bind(InfraTypes.authorizeAdminHttp)
  .to(AuthorizeHttpClientDecorator);

  infraContainer
  .bind(InfraTypes.authorizeDashboardHttp)
  .to(AuthorizeDashboardHttpClientDecorator);


infraContainer.bind(InfraTypes.makeApiURL).to(makeApiURL);

export { infraContainer };
