import { PageWrapper, useMutation, useToast } from "infinity-forge";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { whatsappConfigService } from "@/OLD/services/whatsapp-config.service";
import FormChild from "../FormChild";

const CreateWhatsapp = memo(function CreateWhatsapp() {
  const [data, setData] = useState({
    tintimClientId: "",
    whatsappPhone: "",
    platformIntegration: "",
    active: true,
  });

  const router = useRouter();
  const { createToast } = useToast();

  const createConfigMutation = useMutation({
    queryKey: ["create-whatsapp-config"],
    queryFn: async () => {
      await whatsappConfigService.createConfig({
        tintimClientId: data.tintimClientId,
        whatsappPhone: data.whatsappPhone ?? "",
        platformIntegration: data.platformIntegration ?? "",
      });

      createToast({
        message: "Configuração criada com sucesso",
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
      />
    </PageWrapper>
  );
});

export default CreateWhatsapp;
