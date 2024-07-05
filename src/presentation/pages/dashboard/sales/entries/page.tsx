import { useTable, useGetQueryArgumentsTable } from 'infinity-forge'

import { Entrie } from '@/domain'
import { TypesAutomatiza, container } from '@/container'

import { columns } from './table'

import * as S from './styles'

export function EntriesPageComponent() {

  const query = useGetQueryArgumentsTable({
    container,
    Types: TypesAutomatiza,
    queryKey: {
      remoteName: 'RemoteEntries' as keyof typeof TypesAutomatiza
    },
    dynamicFiltersFromApi: false,
    requireUser: false,
  })

  const { Table } = useTable<Entrie, keyof typeof TypesAutomatiza>({
    query,
    configs: {
      errorMessage: 'Nenhuma entrada encontrada.',
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
