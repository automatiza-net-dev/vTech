import { useTable, useGetQueryArgumentsTable } from 'infinity-forge'

import { EntrieReport } from '@/domain'
import { TypesAutomatiza, container } from '@/container'

import { columns } from './table'

import * as S from './styles'

export function EntriesReportsPageComponent() {

  const query = useGetQueryArgumentsTable({
    container,
    Types: TypesAutomatiza,
    queryKey: {
      remoteName: 'RemoteReportsEntries' as keyof typeof TypesAutomatiza
    },
    dynamicFiltersFromApi: false,
    requireUser: false,
  })

  const { Table } = useTable<EntrieReport, keyof typeof TypesAutomatiza>({
    query,
    configs: {
      errorMessage: 'Nenhuma reporte de entrada encontrada.',
      disableOrdenationTable: false,
    },
    columnsConfiguration: {
      columns,
      actions: {
        detail: (tableItem) => `/entrada/` + tableItem.id,
      },
    },
  })

  return (
    <S.EntriesPageComponent>
      <div className='table-container'>{Table}</div>
    </S.EntriesPageComponent>
  )
}
