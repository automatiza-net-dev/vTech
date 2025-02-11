// @ts-nocheck
import { memo, useEffect } from "react";

import { useRouter } from "next/router";

import { profileService } from "@/OLD/services/External/profileService";
import { LoadingPage } from "@/OLD/components/mini-components/LoadingPage";
import { useToast } from "infinity-forge";

const ExternalAccess = memo(function ExternalAccess() {
  const router = useRouter();

  const {createToast} = useToast()

  const verifyToken = () => {
    profileService
      .checkProfile()
      .then((res) =>
        res.data?.unit ? router.push("/dashboard") : router.push("/dashboard")
      )
      .catch((err) => {
      createToast({ status: "error", message:"Token inválido" })
    
        return router.back();
      });
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return <LoadingPage />;
});

export default ExternalAccess;
