export type CreatePatient = {
  create: (params: CreatePatient.Params) => Promise<CreatePatient.Model>;
};

export namespace CreatePatient {
  export type Params = {
    name: string;
    raceId: string;
    gender: string;
    birthDate: string;
    community: boolean;
    active: boolean;
    tags: string;
    vaccineOrigin: string;
    castrated: string;
    microchip: string;
    hairId: string;
    death: string;
    holderId: string;
    deathDate?: Date | string;
    photo?: File | string;
  };

  export type Model = {};
}
