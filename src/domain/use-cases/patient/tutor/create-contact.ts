export type Contact = {
  contact: string;
  main: boolean;
  notGiven: boolean;
  observation: string;
  patientId: string;
  type: "celular" | "email";
};

export type CreateContact = {
  createContact: (params: CreateContact.Params) => Promise<{}>;
};

export namespace CreateContact {
  export type Params = {
    items: Contact[];
  };
}
