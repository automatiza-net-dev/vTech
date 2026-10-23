import { Error, Profile, WorkSpace, Notifications } from 'infinity-forge'

import * as S from './styles'
import { SelectWorkSpace } from './select-workspace'
import { VersionBadge } from './version-badge'

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

        <S.ProfileWrapper>
          <Pro />
          <VersionBadge />
        </S.ProfileWrapper>
      </S.MenuRight>
    </Error>
  )
}
