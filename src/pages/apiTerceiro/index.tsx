import { useRouter } from "next/router";

import axios from "axios";
import { useQuery } from "react-query";
import { useAuthAdmin } from "infinity-forge";

import { User } from "@/domain";
import { Storage } from "@/infra";
import { RemoteBusinessUnits } from "@/data";
import { callApiOneTime } from "@/presentation";
import { InfraTypes, adminTypes, container } from "@/container";

export default function ValidaTerceiros() {
  const router = useRouter();

  const { loadUser } = useAuthAdmin();

  useQuery({
    queryKey: ["validarToken", router.query.token],
    queryFn: async () => {
      try {
        const token = router.query.token as string;

        const response = await axios.get<User>(
          process.env.NEXT_PUBLIC_API + "/auth/me",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );

        if (response.data.user.type === "user") {
          container
            .get<Storage>(InfraTypes.storage)
            .set("adminUser", { value: null });

          container
            .get<Storage>(InfraTypes.storage)
            .set("user", { value: token });

          const responseBusinessUnits = await container
            .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
            .loadAllAvailableSwaps({ dashboard: true });

          if (responseBusinessUnits && responseBusinessUnits.length > 0) {
            await container
              .get<RemoteBusinessUnits>(adminTypes.RemoteBusinessUnits)
              .swap({ dashboard: true, unitId: responseBusinessUnits[0].id });
          }

          await loadUser({ roleUser: "user" });

          if (router.query.log) {
            return;
          }

          router.push("/dashboard");
        } else {
          container
            .get<Storage>(InfraTypes.storage)
            .set("adminUser", { value: null });

          container
            .get<Storage>(InfraTypes.storage)
            .set("user", { value: token });

          if (router.query.log) {
            return;
          }

          router.push("/admin");
        }
      } catch (err) {
        if (router.query.log) {
          return;
        }
        router.push("/");
      }
    },
    ...callApiOneTime,
    enabled: !(router.query.isReady && !!router.query.token),
  });

  return <></>;
}
