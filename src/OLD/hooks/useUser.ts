// @ts-nocheck
import { useEffect, useState } from "react";
import { userService } from "@/OLD/services/user.service";

export const useSingleUser = (id: string) => {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    userService
      .getOneUser(id)
      .then((res) => setUser(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    loadingUser: loading,
    user,
    fetchUser: fetchData,
  };
};
