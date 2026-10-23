import styled from "styled-components";

import { versionBadge } from "@/presentation/components/layout/version-badge";

export const Layout = styled("div")`
  ${versionBadge}

  .icon {
    display: flex !important;
  }
`;
