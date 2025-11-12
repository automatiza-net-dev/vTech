import { PageWrapper, useMutation, useToast } from "infinity-forge";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { whatsappConfigService } from "@/OLD/services/whatsapp-config.service";
import { useShowWhatsappConfig } from "@/OLD/hooks/useWhatsappConfig";
import FormChild from "../FormChild";
import { useParams } from "next/navigation";

const UpdateWhatsapp = memo(function UpdateWhatsapp() {
  const [data, setData] = useState({
    tintimClientId: "",
    whatsappPhone: "",
    platformIntegration: "",
    active: false,
  });

  const router = useRouter();
  const params = useParams();
  const { createToast } = useToast();

  const config = useShowWhatsappConfig(
    params.id && typeof params.id === "string" ? params.id : "0",
  );
  useEffect(() => {
    if (!config.data) {
      return;
    }

    setData({
      tintimClientId: config.data.tintimClientId ?? "",
      whatsappPhone: config.data.whatsappPhone ?? "",
      platformIntegration: config.data.platformIntegration ?? "",
      active: config.data.active ?? false,
    });
  }, [config.data]);

  const createConfigMutation = useMutation({
    queryKey: ["update-whatsapp-config"],
    queryFn: async () => {
      await whatsappConfigService.updateConfig(params.id as string, data);

      createToast({
        message: "Configuração atualizada com sucesso",
        status: "success",
      });

      await router.push("/dashboard/whatsapp");
    },
  });

  return (
    <PageWrapper title="Cadastrar nova configuração">
      <FormChild
        submit={() => createConfigMutation.mutate()}
        data={data}
        setData={setData}
        showActive
      />
    </PageWrapper>
  );
});

export default UpdateWhatsapp;
