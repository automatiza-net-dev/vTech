import { useAuthAdmin } from "infinity-forge";

import { callApiOneTime, useSystem } from "@/presentation";
import { RemoteConfiguration } from "@/data";
import { dictionaryStore } from "./store";
import { useQuery } from "react-query";
import { container, TypesAutomatiza } from "@/container";

export function useDictionary() {
  const lang = "ptBr";

  const { unit } = useSystem()

  const client = unit?.system?.type === "Vet"
      ? "cliente-veterinaria"
      : "cliente-estetica";

  const dictionary = dictionaryStore((state) => state.dictionary);

  function getWord(word) {
    if (
      dictionary &&
      dictionary[lang] &&
      dictionary[lang][word] &&
      dictionary[lang][word][client]
    ) {
      return dictionary[lang][word][client] as string;
    }

    return "";
  }

  return { getWord, isFetching: false };
}

export function DictionaryQueryProvider({ children }) {
  const { user } = useAuthAdmin();

  useQuery({
    queryKey: "Dictionary",
    queryFn: async () => {
      try {
        const t = await container
          .get<RemoteConfiguration>(TypesAutomatiza.RemoteConfiguration)
          .loadAllDictionary();

        dictionaryStore.setState({ dictionary: t });

        return t;
      } catch (err) {
        dictionaryStore.setState({ dictionary: {} });
        return {};
      }
    },
    enabled: !!user,
    ...callApiOneTime,
  });

  const dictionary = dictionaryStore((state) => state.dictionary);

  if (dictionary) {
    return children;
  }

  return <></>;
}
