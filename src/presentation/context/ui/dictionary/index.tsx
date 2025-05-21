import { useAuthAdmin } from "infinity-forge";

import { callApiOneTime, useConfigurationsSystem } from "@/presentation";
import { RemoteConfiguration } from "@/data";
import { dictionaryStore } from "./store";
import { useQuery } from "infinity-forge";
import { container, TypesAutomatiza } from "@/container";

export function useDictionary() {
  const lang = "ptBr";

  const {type} = useConfigurationsSystem()

  const client = type === "Vet"
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
    queryKey: ["Dictionary"],
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
    enableCache: true,
  });

  const dictionary = dictionaryStore((state) => state.dictionary);

  if (dictionary) {
    return children;
  }

  return <></>;
}
