import { Product, User } from '@/domain'

export type ScheduleExecution = {
  produto?: string;
  treatmentId: number;
  treatmentItemId: number;
  productivityItemId: number;
  treatmentExecutionId: number;
  itemProdutividade: string | null;
  executionDate?: string;
  scheduleDate?: string;
  productId: Product['id'];
  productDescription: Product['description'];
  productivityItemdescription: string;
  executionUserId: User['id'] | null;
  executionUserName: User['name'] | null;
};
