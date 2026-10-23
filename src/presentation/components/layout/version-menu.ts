// Origem do build (servidor, Vercel ou local) exibida no menu do avatar
const origin = process.env.appOrigin || "LOCAL";
const commit = process.env.appCommit;

export const appVersionLabel = commit ? `${origin} · ${commit}` : origin;

export const versionMenuItem = {
  title: `Versão: ${appVersionLabel}`,
  onClick: () => navigator.clipboard?.writeText(appVersionLabel),
};
