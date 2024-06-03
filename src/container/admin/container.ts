import { Container } from "inversify";

import { RemoteAuthAdmin } from "../../data/use-cases/auth/remote-auth-admin";
import { RemoteBusinessUnits } from "../../data/use-cases/business-units/remote-business-units";
import { RemoteUserController } from "../../data/use-cases/user-controller/remote-user-controller";
import { RemoteControllerRole } from "../../data/use-cases/controller-role/remote-controller-role";
import { RemoteAccessControls } from "../../data/use-cases/access-controls/remote-access-controls";
import { RemoteLoadUrlsSearch } from "../../data/use-cases/configurations-system/remote-load-urls-search";
import { RemoteUpdateDepartaments } from "../../data/use-cases/access-controls/remote-update-departaments";

import { adminTypes } from "./types";
import { infraContainer } from "../infra";

const adminContainer = new Container({
  defaultScope: "Singleton",
  autoBindInjectable: true,
});

adminContainer.parent = infraContainer;

adminContainer.bind(adminTypes.RemoteAuthAdmin).to(RemoteAuthAdmin);
adminContainer.bind(adminTypes.RemoteBusinessUnits).to(RemoteBusinessUnits);
adminContainer.bind(adminTypes.RemoteControllerRole).to(RemoteControllerRole);
adminContainer.bind(adminTypes.RemoteUserController).to(RemoteUserController);
adminContainer.bind(adminTypes.RemoteAccessControls).to(RemoteAccessControls);
adminContainer.bind(adminTypes.RemoteLoadUrlsSearch).to(RemoteLoadUrlsSearch);
adminContainer.bind(adminTypes.RemoteUpdateDepartaments).to(RemoteUpdateDepartaments);

export { adminContainer };
