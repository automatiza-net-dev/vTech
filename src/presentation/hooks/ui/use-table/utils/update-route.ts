import { NextRouter } from "next/router";

export function updateRoute({
  reset,
  router,
  params,
}: {
  params: any;
  reset?: boolean;
  router: NextRouter;
}) {
  if (reset) {
    router.push({
      pathname: router.pathname,
      query: { ...params },
    });
    return;
  }

  router.push({
    pathname: router.pathname,
    query: { ...router.query, ...params },
  });

  return;
}
