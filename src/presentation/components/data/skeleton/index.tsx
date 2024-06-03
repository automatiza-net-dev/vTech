import MuiStack from "@mui/material/Stack";

import { Error } from "@/presentation"
import { SkeletonLine } from "./skeleton-line";
import { SkeletonCircle } from "./skeleton-circle";

import { ISkeletonProps } from "./interfaces";

import * as S from "./styles";

export function Skeleton({ type, spacing = 1 }: ISkeletonProps) {
  return (
    <Error name="skeleton">
      <S.SkeletonCustom data-testid="skeleton">
        <MuiStack spacing={spacing}>
          {type === "table" && (
            <>
              <SkeletonLine />
              <SkeletonLine />
            </>
          )}

          {type === "profile" && (
            <>
              <div className="avatar">
                <SkeletonCircle />
                <SkeletonLine width="80%" />
              </div>

              <SkeletonLine width="100%" height={50} />
              <SkeletonLine />
              <SkeletonLine width="100%" />
              <SkeletonLine width="50%" />
            </>
          )}

          {type === "card" && (
            <>
              <SkeletonLine width="100%" height={120} />
              <SkeletonLine />
              <SkeletonLine />
            </>
          )}

          {type === "line" && <SkeletonLine />}
        </MuiStack>
      </S.SkeletonCustom>
    </Error>
  );
}
