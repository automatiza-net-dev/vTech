export function calcRefCusto(
  refCusto: string,
  baseDeCusto?: Record<string, { custo: number; total?: number }>,
  isTotal?: boolean
): number | null {
  if (refCusto) {
    const refCustosIds: string[] = refCusto
      .split(" ")
      .filter((item) => !isNaN(Number(item)) || /^[+\-*/]$/.test(item.trim()))
      .filter((item) => item !== "");

    const refCustosValues = refCustosIds.map((item) => {
      if (!isNaN(Number(item))) {
        return isTotal
          ? baseDeCusto?.[item]?.total || 0
          : baseDeCusto?.[item]?.custo || 0;
      }

      return item;
    });

    const sanitizedCalculation = refCustosValues.join(" ");

    try {
      const result = new Function(`return ${sanitizedCalculation}`)();

      return result;
    } catch (error) {
      return 0;
    }
  }

  return 0;
}
