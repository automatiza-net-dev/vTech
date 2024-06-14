export type CreatePatient = {
  create: (params: CreatePatient.Params) => Promise<CreatePatient.Model>;
};

export namespace CreatePatient {
  export type Params = {
    name: string;
    raceId: {
      value: string;
      id: string;
    };
    gender: string;
    birthDate: string;
    community: boolean;
    active: boolean;
    tags: string;
    vaccineOrigin: string;
    castrated: boolean;
    microchip: string;
    hairId: string;
    death: boolean;
    holderId: boolean;
    deathDate?: Date;
    photo?: File;
  };

  export type Model = {};
}
