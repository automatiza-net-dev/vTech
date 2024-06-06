import { useQuery } from "react-query";
import { useRouter } from "next/router";

import { User } from "@/domain";
import { Storage } from "@/infra";
import { InfraTypes, container } from "@/container";

import axios from "axios";
import { useAuthAdmin } from "infinity-forge";

export default function ValidaTerceiros() {
    const router = useRouter();

    const { loadUser } = useAuthAdmin();

    useQuery({
      queryKey: ["validarToken", router.query.token],
      queryFn: async () => {
        try {
          const token = router.query.token as string;
  
          const response = await axios.get<User>(process.env.NEXT_PUBLIC_API + "/auth/me", {
            headers: { Authorization: "Bearer " + token },
          });
  
          if (response.data.user.type === "user") {
    
            container.get<Storage>(InfraTypes.storage).set("adminUser", { value: null });
            container.get<Storage>(InfraTypes.storage).set("token", { value: token });

            await loadUser();
    
            router.push("/dashboard");
          } else {
    
            container.get<Storage>(InfraTypes.storage).set("adminUser", { value: null });
            container.get<Storage>(InfraTypes.storage).set("token", { value: token });
    
            router.push("/admin");
          }
        }catch {
          router.push("/")
        }
      },
      enabled: !(
        router.query.isReady &&
        !!router.query.token
      ),
    });
  
    return <></>;
}