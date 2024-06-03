import {  useEffect } from "react";
import { useRouter } from "next/router";

import api from "@/OLD/services";
import { useSingleUser } from "@/OLD/hooks/useUser";
import { useSingleInvite } from "@/OLD/hooks/useInvites";
import { LoadingPage } from "@/OLD/components/mini-components";

export default function InvitesRedirectControl() {
  const router = useRouter();

  const { invite } = useSingleInvite(router?.query?.token);
  const { user } = useSingleUser(invite?.user_id || "");

  useEffect(() => {
    (async () => {
      await api.get(`/users/check-email/${invite?.email}`).then(() => {
        if (invite?.email) {
          user?.name === "[NOT REGISTERED]"
            ? router.push(`/convite/aceitar/${router.query.token}`)
            : router.push(`/convite/novo-usuario/${router.query.token}`);
        }
      });
    })()
  }, [invite]);

  return <LoadingPage />;
};

