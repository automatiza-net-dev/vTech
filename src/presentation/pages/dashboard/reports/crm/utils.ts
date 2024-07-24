import moment from "moment";

export const formatSanclaArquive = (reports) =>
  reports &&
  reports.map((report) => ({
    unidade: report.unidade,
    usuario_responsavel_oportunidade: report.responsavel,
    cliente: report.nome_contato,
    telefone: report.celular_contato,
    categoria_origem_cliente: report.origem_categoria,
    grupo_origem_cliente: report.origem_grupo,
    origem_cliente: report.origem_cliente,
    campanha_midia: report.campanha_midia,
    profissao: report.profissao,
    nome_paciente: report.nome_paciente,
    raca_paciente: report.raca_paciente,
    genero_paciente: report.genero_paciente,
    paciente_castrado: report.castrado_paciente,
    data_contato: report.data_contato
      ? moment(report.data_contato).format("DD/MM/YYYY")
      : "-",
    data_abertura: report.data_abertura
      ? moment(report.data_abertura).format("DD/MM/YYYY")
      : "-",
    data_lançamento: report.data_lancamento
      ? moment(report.data_lancamento).format("DD/MM/YYYY")
      : "-",
    titulo: report.titulo_oportunidade,
    valor_oportunidade: report.valor_oportunidade,
    status: report.status_oportunidade,
    assunto: report.assunto_contato,
    tipo_contato: report.tipo_contato,
    situacao: report.situacao,
    motivo_ganho_perda: report.motivo_ganho_perda,
    obs_ganho_perda: report.obse_ganho_perda,
    valor_ganho: report.valor_ganho,
    usuario_lancamento: report.usuariolancamento,
  }));

export const formatLiftoneArquive = (reports) =>
  reports &&
  reports.map((report) => ({
    unidade: report.unidade,
    usuario_responsavel_oportunidade: report.responsavel,
    cliente: report.nome_contato,
    telefone: report.celular_contato,
    categoria_origem_cliente: report.origem_categoria,
    grupo_origem_cliente: report.origem_grupo,
    origem_cliente: report.origem_cliente,
    campanha_midia: report.campanha_midia,
    profissao: report.profissao,
    data_contato: report.data_contato
      ? moment(report.data_contato).format("DD/MM/YYYY")
      : "-",
    data_abertura: report.data_abertura
      ? moment(report.data_abertura).format("DD/MM/YYYY")
      : "-",
    data_lançamento: report.data_lancamento
      ? moment(report.data_lancamento).format("DD/MM/YYYY")
      : "-",
    titulo: report.titulo_oportunidade,
    valor_oportunidade: report.valor_oportunidade,
    status: report.status_oportunidade,
    assunto: report.assunto_contato,
    tipo_contato: report.tipo_contato,
    situacao: report.situacao,
    motivo_ganho_perda: report.motivo_ganho_perda,
    obs_ganho_perda: report.obse_ganho_perda,
    valor_ganho: report.valor_ganho,
    usuario_lancamento: report.usuariolancamento,
  }));
