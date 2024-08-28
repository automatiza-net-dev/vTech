import axios from "axios";
import { Storage } from "@/infra";
import { container, TypesAutomatiza } from "@/container";
import { createContext, useEffect, useState } from "react";

export const IpContext = createContext<{}>({});

export const IpProvider = ({ children }) => {
  const [startApplication, setStartApplication] = useState(false);

  async function getIpAddres() {
    const IPAddress = await axios.get("https://api.ipify.org/");
    return IPAddress?.data || (null as string | null);
  }

  useEffect(() => {
    (async () => {
      const storage = container.get<Storage>(TypesAutomatiza.storage);
      const ipStorage = await storage.get<"ip">("ip");
      const ip = ipStorage?.value;

      if (ip) {
        setStartApplication(true);
        const responseIpAddres = await getIpAddres();
        if (responseIpAddres !== ip) {
          storage.set<"ip">("ip", { value: null });
        }
      } else {
        const responseIpAddres = await getIpAddres();
        storage.set("ip", { value: responseIpAddres });
        setStartApplication(true);
      }
    })();
  }, []);

  return (
    <IpContext.Provider value={{}}>
      {startApplication && children}
    </IpContext.Provider>
  );
};
