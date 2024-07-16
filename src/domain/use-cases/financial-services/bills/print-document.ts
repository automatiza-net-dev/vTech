export type PrintDocument = {
  printDocument: (params: PrintDocument.Params) => void;
};

export namespace PrintDocument {
  export type Params = {
    billDocumentId: number;
  };
}
