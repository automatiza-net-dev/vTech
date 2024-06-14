import { TypesAutomatiza, container } from "@/container";
import { RemotePatient } from "@/data";
import { FormHandler, Input, Select } from "infinity-forge";

export function CreatePatient() {
  return (
    <FormHandler
      onSucess={async (data) => {
        const payload = {
          name: "",
          raceId: {
            value: "",
            id: "",
          },
          gender: "",
          birthDate: "",
          community: false,
          active: false,
          tags: "",
          vaccineOrigin: "",
          castrated: false,
          microchip: "",
          hairId: "",
          death: false,
          holderId: false,
          deathDate: new Date(),
          photo: {},
        };

        await container
          .get<RemotePatient>(TypesAutomatiza.RemotePatient)
          .create(data);
      }}
    >
      <Input name="name" label="Nome" />

      {/* <Select name="" /> */}
    </FormHandler>
  );
}
