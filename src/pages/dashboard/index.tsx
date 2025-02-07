import { DashboardPage, LayoutDashboard } from "@/presentation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {

  const router = useRouter();

  useEffect(() => {
    if (router.query.reload) {
      const newQuery = { ...router.query };
      delete newQuery.reload; 

      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true } 
      ).then(() => {
        window.location.reload(); 
      });
    }
  }, [router.query]);
  
  return (
    <LayoutDashboard>
      <DashboardPage />
    </LayoutDashboard>
  );
}
