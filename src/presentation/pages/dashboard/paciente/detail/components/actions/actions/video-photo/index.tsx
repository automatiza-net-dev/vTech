import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import {
  Error,
  FormHandler,
  Input,
  useToast,
  Textarea,
  InputFile,
  useAuthAdmin,
  api,
  FileSystemType,
} from "infinity-forge";

import { DropdownComponentProps } from "../dropdown-item";

import * as S from "./styles";
import { useQueryClient } from "@/presentation/use-query";

export function VideoPhoto({ setModal, ...rest }: DropdownComponentProps) {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<FileSystemType[] | null>(null);

  const { createToast } = useToast();

  const router = useRouter();
  const userId = useAuthAdmin().user.id;

  const patientId = router.query.id as string;

  const refetch = useQueryClient((st) => st.refetch);

  useEffect(() => {
    (async () => {
      try {
        if(!rest.timeline_info) {
          return;
        }

        setLoading(true);

        let photos = rest.timeline_info?.photos || [];
        let newPhotos: any[] = [];

        for (const photo of photos) {
          const response = await api({
            url: "s3/generate-link",
            method: "post",
            body: { key: photo.url },
          });

          newPhotos.push({ ...photo, url: response.view });
        }

        setPhotos(newPhotos);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Error name="VideoPhoto">
      <S.VideoPhoto>
        {!loading && (
          <FormHandler
            button={{ text: "Salvar" }}
            initialData={{ ...(rest?.timeline_info || {}), photos }}
            onSucess={async (data) => {
              const payload = {
                title: data.title,
                observation: data.observation,
                photos: (data?.photos as FileSystemType[])?.map(
                  (item) => item.file
                ),
                tag: patientId,
                technicianId: userId,
              };

              await api({
                url: "n-timeline/photos",
                method: "post",
                body: payload,
                headers: {
                  "Content-Type": "multipart/form-data; boundary=something",
                },
              });

              await refetch(["LastUpdates"], { mode: "include" });

              createToast({
                message: "Video/Foto criada com sucesso!",
                status: "success",
              });

              setModal && setModal(false);
            }}
            cleanFieldsOnSubmit={false}
            isStickyButtons
            disableEnterKeySubmitForm
          >
            <Input name="title" label="Titulo" />

            <Textarea name="observation" label="Observações" />

            <InputFile name="photos" isAccumalativeFile multiple isLocalFile />
          </FormHandler>
        )}
      </S.VideoPhoto>
    </Error>
  );
}
