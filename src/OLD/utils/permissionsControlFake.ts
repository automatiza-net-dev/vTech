const modules = [
  {
    mod: "documentos",
    DOC1: true,
    DOC2: true,
    DOC3: true
  },
  { mod: "receitasMedicas", REC1: true, REC2: true, REC3: true },
  { mod: "patologias", PAT1: true, PAT2: true, PAT3: true },
  { mod: "vacinas", VAC1: true, VAC2: true, VAC3: true },
  { mod: "subgrupos", SBG2: true, SBG3: true },
  { mod: "produtos", PRD3: true },
  { mod: "servicos", SRV3: true },
  { mod: "racas", RAC3: true },
  { mod: "especies", ESP3: true },
  { mod: "agendamentoStatus", AST1: true, AST2: true, AST3: true },
  { mod: "servicosAgendamento", ASV1: true, ASV2: true, ASV3: true },
  { mod: "tipoServicosAgendamento", ATS1: true, ATS2: true, ATS3: true },
  { mod: "planoContas", PCT1: true, PCT2: true, PCT3: true },
  { mod: "grupoPlanoContas", GPC1: true, GPC2: true, GPC3: true },
  { mod: "operacoesFiscais", OPF1: true, OPF2: true, OPF3: true }
];

export const permissionControl = (str) =>
  modules.find((item) => item?.mod === str);
