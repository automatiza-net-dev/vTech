export type LoadAllPathologies = {
  loadAllPathologies: () => Promise<LoadAllPathologies.Model>;
};

export type Pathologie = {
  id: string;
  timeline_type_id: string;
  description: string;
  definition: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  template: string;
  timelineType: {
    id: string;
    description: string;
    color: string;
    requires_observation: boolean;
    created_at: string;
    updated_at: string;
  };
};

export namespace LoadAllPathologies {
  export type Model = Pathologie[];
}
