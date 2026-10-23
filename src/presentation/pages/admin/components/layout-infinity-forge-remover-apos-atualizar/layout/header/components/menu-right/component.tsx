import { Error, Profile, WorkSpace, Notifications } from 'infinity-forge'

import * as S from './styles'
import { SelectWorkSpace } from './select-workspace'
import { versionMenuItem } from '@/presentation/components/layout/version-menu'

interface IMenuRight {
  workspaces: WorkSpace
}

const Pro = Profile as any

export function MenuRight(props: IMenuRight) {
  return (
    <Error name='MenuRight'>
      <S.MenuRight>
        {props.workspaces && <SelectWorkSpace workspaces={props.workspaces} />}

        <Notifications />

        <Pro profile={{ menus: [versionMenuItem] }} />
      </S.MenuRight>
    </Error>
  )
}
