import { Error, Profile, WorkSpace, Notifications } from 'infinity-forge'

import * as S from './styles'
import { SelectWorkSpace } from './select-workspace'

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

        <Pro />
      </S.MenuRight>
    </Error>
  )
}
