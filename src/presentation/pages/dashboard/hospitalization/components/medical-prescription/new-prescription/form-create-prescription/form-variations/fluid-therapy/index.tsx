import { api, Input, InputCurrency, Select, useQuery } from "infinity-forge";

export function FluidTherapy() {

  const fluidVelocities = useQuery({
    queryKey:["FLUID_VELOCITY"],
    queryFn: async () => {
      const response = await api({
        url: "units",
        method: "get",
        body: { type: "FLUID_VELOCITY" },
      });

      return response;
    },
    enableCache: true,
  });

  return (
    <div className="row">
      <Select
        label="Equipo"
        name="fluidSet"
        onlyOneValue
        options={[
          { label: "Macro gotas", value: "MACRODROPS" },
          { label: "Micro gotas", value: "MICRODROPS" },
        ]}
      />

      <InputCurrency
        prefix=" "
        name="fluidSpeed"
        label="Velocidade"
      />
      
      <Select
        label="Unidade Velocidade"
        name="fluidUnitId"
        onlyOneValue
        options={
          fluidVelocities?.data?.map((item) => ({
            label: item.tag,
            value: item?.id,
          })) || []
        }
      />

      <Input name="supplement" label="Suplemento" />
    </div>
  );
}
