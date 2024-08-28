export type UnlinkPetTutor = {
  unlink: (params: UnlinkPetTutor.Params) => Promise<UnlinkPetTutor.Model>;
};

export namespace UnlinkPetTutor {
  export type Params = {
    tutorId: string;
    patientId: string;
  };

  export type Model = {};
}
