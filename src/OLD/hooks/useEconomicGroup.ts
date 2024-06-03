import { useEffect, useState } from "react";
import { userService } from "@/OLD/services/user.service";

export function useEconomicGroup() {
  const [economicGroup, setEconomicGroup] = useState("");
  const [allEconomicGroup, setAllEconomicGroup] = useState([]);

  useEffect(() => {
      userService.getEconomicGroups().then((res) => {
        setEconomicGroup(res.data[0].id);
        setAllEconomicGroup(res.data);
      });
  }, []);

  return { economicGroup, allEconomicGroup };
}
