import { useEffect, useState } from "react";

import { api, NextImage } from "infinity-forge";

import * as S from "./styles";

export function useUploadS3({ src }) {
  const [s3, setS3 ] = useState<{download: string, view: string}>({ download: "", view: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(src) {
  if (!src?.includes(".s3.")) {
      (async () => {
        setLoading(true);

        const response = await api({
          url: "s3/generate-link",
          method: "post",
          body: { key: src },
        });

        setS3(response);

        setLoading(false);
      })();
    } else {
      setS3(src)
      setLoading(false);
    }
    }
  }, [src]);

  return { s3, loading };
}

export function ImageUploadS3({ src }: { src?: string }) {
  const { loading, s3 } = useUploadS3({ src });
  return (
    <S.ImageUploadS3>
      <NextImage forceLoading={loading} src={s3.view || src} />
    </S.ImageUploadS3>
  );
}
