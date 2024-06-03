import api from "@/OLD/services";

const listAll = async () => await api.get("template-replacements");

const replaceText = async (data) =>
  await api.post("template-replacements/replace-text", data);

export const textReplaceService = {
  listAll,
  replaceText
};
