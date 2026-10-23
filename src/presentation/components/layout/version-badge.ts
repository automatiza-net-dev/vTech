import { css } from "styled-components";

// Selo com a origem do build (servidor, Vercel ou local) sobre o avatar do header da infinity-forge
const colors: Record<string, string> = {
  "SRV DEV": "#16a34a",
  VERCEL: "#111827",
  LOCAL: "#6b7280",
};

const origin = process.env.appOrigin || "LOCAL";
const commit = process.env.appCommit;
const label = commit ? `${origin} · ${commit}` : origin;

export const versionBadge = css`
  #profile-btn {
    position: relative;

    &::after {
      content: "${label}";
      position: absolute;
      left: 50%;
      bottom: -8px;
      transform: translateX(-50%);
      z-index: 23;
      padding: 1px 5px;
      border-radius: 4px;
      background: ${colors[origin] || "#b45309"};
      color: #fff;
      font-size: 9px;
      font-weight: 600;
      line-height: 13px;
      white-space: nowrap;
      pointer-events: none;
    }
  }
`;
