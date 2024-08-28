import { Button } from "infinity-forge";

import * as S from "./styles";

export function NewAttachments({
  setFileList,
}: {
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const storeFiles = (filelist) => {
    const fileObj = {
      file: filelist[0],
      url: window.URL.createObjectURL(filelist[0]),
      status: "pending",
      filename: filelist[0]?.name,
    };

    setFileList((prv) => [...prv, fileObj]);
  };

  return (
    <S.NewAttachments>
      <label htmlFor="file-upload" className="custom-file-upload">
        adicionar arquivo
      </label>
      <input
        type="file"
        id="file-upload"
        onChange={(e) => storeFiles(e.target.files)}
      />
    </S.NewAttachments>
  );
}
