import { User } from "@/domain";

export type Photos = {
  url: string;
  filename: string;
};

export type Attachment = {
  _id: string;
  timeline_id: string;
  timeline_type: {
    description: "Fotos";
    color: string;
    requires_observation: boolean;
  };
  timeline_info: {
    tag: string;
    photos?: Photos[];
    observation: string;
    title: string;
    technician: User;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AddAttachment = {
  addAttachment: (params: AddAttachment.Params) => Promise<void>;
};

export namespace AddAttachment {
  export type Params = {
    attachmentId: Attachment["_id"];
    files: any[];
  };
}

// TODO Verificar tipagem de arquivos
