import { Error, Profile, WorkSpace, Notifications, SelectWorkSpace } from 'infinity-forge'

import * as S from './styles'

interface IMenuRight {
  workspaces: WorkSpace
}

export function MenuRight(props: IMenuRight) {
  return (
    <Error name='MenuRight'>
      <S.MenuRight>
        {props.workspaces && <SelectWorkSpace workspaces={props.workspaces} />}

        <Notifications />

        <Profile />
      </S.MenuRight>
    </Error>
  )
}
