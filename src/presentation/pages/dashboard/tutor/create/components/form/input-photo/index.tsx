import { InputProps, Icon, FileSystemType } from "infinity-forge";

import { TooltipContainer } from "infinity-forge/dist/ui/components/tooltip/styles";

import { useFile, useRenderedFile } from "infinity-forge";
import { FileButton } from "infinity-forge/dist/ui/components/form/input-file/styles";

import * as S from "./styles";

export function InputPhoto(props: InputProps) {
  const { LabelFileArea, InputFile, UploadCamera, field } = useFile(props);

  const defaultProfile =
    process.env.client === "sancla"
      ? "/images/pages/patient/pet.jpg"
      : "/images/pages/patient/humano.jpg";

  return (
    <div style={{ display: "flex", gap: 10, width: "fit-content" }}>
      <InputFile visible={false} />

      <LabelFileArea>
        <div style={{ height: 200, width: 200 }}>
          {field?.value?.length > 0 ? (
            field?.value?.map((file) => (
              <ResultFile file={file} inputProps={props} />
            ))
          ) : (
            <S.ResultFileStyled>
              <div style={{ height: 200, width: 200 }} className="image_box">
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={defaultProfile}
                />
                <Icon name="IconEditImage" />
              </div>
            </S.ResultFileStyled>
          )}
        </div>
      </LabelFileArea>

      <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
        <TooltipContainer>
          <LabelFileArea>
            <FileButton style={{ padding: 10 }}>
              <Icon fill="#000" name="IconUpload" />
            </FileButton>
          </LabelFileArea>
        </TooltipContainer>

        <UploadCamera />
      </div>
    </div>
  );
}

function ResultFile({
  inputProps,
  file,
}: {
  file: FileSystemType;
  inputProps: InputProps;
}) {
  const { Image, DeleteFileButton, DownloadButton, ShowDetailFileButton } =
    useRenderedFile({
      ...inputProps,
      file,
    });

  return (
    <S.ResultFileStyled>
      <div className="image_box">
        <Image />

        <Icon name="IconEditImage" />
      </div>
    </S.ResultFileStyled>
  );
}
