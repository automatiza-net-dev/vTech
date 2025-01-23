import { numberUtils } from "@/presentation/utils";
import { DreItem } from "../types";

export function flattenHierarchyToObject(dreData?: DreItem[]) {
  const dreFlatten = {};
  const dreSplittedArray: any[] = [];

  function processGroup(group, parentId = null) {

    const payload = {
      id: group?.id,
      tag: group?.tag,
      description: group.description,
      type: group.type || null,
      custo: group.custo || 0,
      refCusto: group.refCusto || "",
      parentId,
      refs: group?.refs,
      basear: group?.basear || null,
      total: group?.total,
    };

    if(group.type) {
      console.log(payload.total)
    }

    dreFlatten[group.tag] = payload;
    dreSplittedArray.push(payload);

    if (group.itens) {
      group.itens.forEach((subGroup) =>
        processGroup(subGroup, group.tag)
      );
    }
  }

  dreData?.forEach((item) => {
    if (item.itens) {
      item.itens.forEach((group) => processGroup(group));
    }
  });

  return {
    dreFlatten,
    dreSplittedArray,
    basear: dreSplittedArray?.find((item) => item.basear),
  };
}
