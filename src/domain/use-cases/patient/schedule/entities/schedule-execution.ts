export type ScheduleExecution = {
  produto: string;
  treatmentId: number;
  treatmentItemId: number;
  productivityItemId: number;
  treatmentExecutionId: number;
  itemProdutividade: string | null;
  executionDate?: string;
  scheduleDate?: string;
};
