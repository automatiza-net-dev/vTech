import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { InfraTypes, container } from "infinity-forge";

import { Storage } from "@/infra";

export function useIsThirdPartyUser() {
  const [isThirdParty, setIsThirdParty] = useState(false);

  const router = useRouter();

  async function verifyThirdPartyUser() {
    // const adminUserCookies = await container
    //   .get<Storage>(InfraTypes.storage)
    //   .get<"adminUser">("adminUser");

    // const JB$SCookies = await container
    //   .get<Storage>(InfraTypes.storage)
    //   .get<"JB$S">("JB$S");

    // setIsThirdParty(
    //   !!(JB$SCookies?.isThirdParty || adminUserCookies?.value?.isThirdParty)
    // );

    // return !!(JB$SCookies?.isThirdParty || adminUserCookies?.value?.isThirdParty);
  }

  // > Gambiarra > Deveria informar o back que o token X é terceiro e o back reconhecendo isso me mandaria no /me  .isThirdParty

  useEffect(() => {
    verifyThirdPartyUser();
  }, [router.asPath]);

  return { isThirdParty };
}
