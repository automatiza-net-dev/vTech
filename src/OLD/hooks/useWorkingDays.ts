import { useEffect, useState } from "react";
import { userService } from "@/OLD/services/user.service";

const daysOfWeek = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
];

export const useWorkingDays = (user, reload) => {
  const [workingDays, setWorkingDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkingDays = () => {
    setLoading(true);
    userService
      .getWorkingDays({ user })
      .then((res) => {
        setWorkingDays(
          res.data.sort(
            (a, b) =>
              daysOfWeek.indexOf(a.week_day) - daysOfWeek.indexOf(b.week_day)
          )
        );
      })
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkingDays();
  }, [user, reload]);

  return {
    workingDays,
    loadingWorkingDays: loading,
    fetchWorkingDays,
  };
};
