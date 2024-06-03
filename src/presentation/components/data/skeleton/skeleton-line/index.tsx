import MuiSkeleton from "@mui/material/Skeleton";

import { ISkeletonLineProps } from "./interfaces";

export function SkeletonLine({ width, height }: ISkeletonLineProps) {
  return (
    <MuiSkeleton
      sx={{ bgcolor: "rgba(0,0,0,0.015)", borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
      animation="wave"
      variant="rectangular"
      width={width ? width : "full"}
      height={height ? height : 58}
    />
  );
}
