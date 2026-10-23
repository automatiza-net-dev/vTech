import * as S from './styles'

const colors: Record<string, string> = {
  'SRV DEV': '#16a34a',
  VERCEL: '#111827',
  LOCAL: '#6b7280'
}

export function VersionBadge() {
  const origin = process.env.appOrigin || 'LOCAL'
  const commit = process.env.appCommit
  const builtAt = process.env.appBuiltAt ? new Date(process.env.appBuiltAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : ''

  return (
    <S.VersionBadge $bg={colors[origin] || '#b45309'} title={`${origin} · ${commit || 'sem commit'} · build ${builtAt}`}>
      {commit ? `${origin} · ${commit}` : origin}
    </S.VersionBadge>
  )
}
