import { useEffect } from "react";

export function defineRequireFields(
  origin: "Cadastro" | "Crm" | "Agenda",
  fields: string[]
) {
  useEffect(() => {
    if (typeof window !== "undefined" && origin === "Cadastro") {
      const normalizeText = (text) => {
        return text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      };

      document.querySelectorAll("label").forEach((label) => {
        if (label.textContent) {
          const normalizedLabelText = normalizeText(label.textContent);

          fields.forEach((field) => {
            if (normalizeText(field) === normalizedLabelText) {
              if (!label?.textContent?.trim().endsWith("*")) {
                label.textContent = label.textContent?.trim() + " *";
              }
            }
          });
        }
      });
    }
  }, [origin, fields]);
}
