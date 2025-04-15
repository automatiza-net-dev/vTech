import { useEffect, useState } from "react";

import { api, NextImage } from "infinity-forge";

import * as S from "./styles";

export function ImageUploadS3({ src }: { src?: string }) {
  const [newSrc, setNewSrc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!src?.includes(".s3.")) {
      (async () => {
        setLoading(true);

        const response = await api({
          url: "s3/generate-link",
          method: "post",
          body: { key: src },
        });

        setNewSrc(response?.link);

        setLoading(false);
      })();
    }else {
      setLoading(false)
    }
  }, []);

  return (
    <S.ImageUploadS3>
      <NextImage forceLoading={loading} src={newSrc || src} />
    </S.ImageUploadS3>
  );
}
