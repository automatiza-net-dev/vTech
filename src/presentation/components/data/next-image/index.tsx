import { useState } from "react";

import Image from "next/image";

import { INextImageProps } from "./interfaces";

import * as S from "./styles";

export function NextImage({ src, alt, sizes, forceLoading }: INextImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <S.Image className={loading || forceLoading ? "loading" : ""}>
      <Image
        src={src ? src : "/images/default-image.webp"}
        layout="fill"
        alt={alt || src || ""}
        onLoad={() => setLoading(true)}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setLoading(false);
        }}
        sizes={sizes}
      />
    </S.Image>
  );
}
