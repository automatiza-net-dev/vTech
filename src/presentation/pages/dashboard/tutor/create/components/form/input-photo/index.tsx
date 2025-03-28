import { useState } from "react";

import { InputProps, Icon, FileSystemType } from "infinity-forge";

import { TooltipContainer } from "infinity-forge/dist/ui/components/tooltip/styles";

import { useFile, useRenderedFile } from "infinity-forge";
import { useConfigurationsSystem } from "@/presentation";

import { FileButton } from "infinity-forge/dist/ui/components/form/input-file/styles";

import * as S from "./styles";

export function InputPhoto(props: InputProps) {
  const { LabelFileArea, InputFile, UploadCamera, field } = useFile(props);

  const { type } = useConfigurationsSystem();

  const defaultProfile =
    type === "Vet"
      ? "/images/pages/patient/pet.jpg"
      : "/images/pages/patient/humano.jpg";

  return (
    <div style={{ display: "flex", width: "fit-content", gap: 10 }}>
      <InputFile visible={false} />

      <LabelFileArea>
        <div style={{ height: 200, width: 200 }}>
          {field?.value?.[0]?.url && field?.value?.length > 0 ? (
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
                <Icon name="IconEditImage" color="#000" />
              </div>
            </S.ResultFileStyled>
          )}
        </div>
      </LabelFileArea>

      <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
        <TooltipContainer>
          <LabelFileArea>
            <FileButton style={{ padding: 10 }}>
              <Icon name="IconUpload" color="#000" />
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
  const [onErrorImage, setOnErrorImage] = useState(false);

  const { Image } = useRenderedFile({
    ...inputProps,
    file,
  });

    const { type } = useConfigurationsSystem();

  const defaultProfile =
  type === "Vet"
      ? "/images/pages/patient/pet.jpg"
      : "/images/pages/patient/humano.jpg";

  async function verifyImage() {
    const image = await fetch(file?.url);
    if (image?.headers.get("Content-Type")?.startsWith("image/")) {
      setOnErrorImage(false);
    } else {
      setOnErrorImage(true);
    }
  }

  verifyImage();

  return (
    <S.ResultFileStyled>
      <div className="image_box">
        {!onErrorImage ? <Image /> : <img src={defaultProfile} />}

        <Icon name="IconEditImage" color="#000" />
      </div>
    </S.ResultFileStyled>
  );
}
