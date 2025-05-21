import { api, Select, useQuery } from "infinity-forge";

export function SelectGender({ isRegister }) {
    
  const {data, isFetching} = useQuery({
    queryKey: ["genders"],
    queryFn: async () => {
      const response = await api<string[]>({
        method: "get",
        url: "patient-genders/search",
      });

      return response;
    },
  });

  return (
    <Select
      label={isRegister ? "Gênero*" : "Gênero"}
      name="gender"
      loading={isFetching}
      options={data?.map(item => ({ label: item, value: item })) || []}
      onlyOneValue
    />
  );
}
