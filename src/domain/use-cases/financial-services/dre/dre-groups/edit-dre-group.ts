import { DreGroup } from '@/domain'

export type EditDreGroup = {
  editDreGroup: (
    params: EditDreGroup.Params
  ) => Promise<DreGroup>;
};

export namespace EditDreGroup {
  export type Params = {
    description?: string;
    sequence?: number;
    active?: boolean;
  };

  export type Model = DreGroup;
}
