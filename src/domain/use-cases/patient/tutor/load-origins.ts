export type LoadTutorOrigins = {
  loadOrigins: () => Promise<LoadTutorOrigins.Model>;
};

export type TutorOrigin = {
  id: string;
  type: string;
  default: boolean;
  description: string;
};

export namespace LoadTutorOrigins {
  export type Model = TutorOrigin[];
}
