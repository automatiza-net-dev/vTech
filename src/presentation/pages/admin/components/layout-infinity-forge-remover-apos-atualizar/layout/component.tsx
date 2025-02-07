import { zIndexInfinityForge } from 'infinity-forge'

import { ILayout } from './interfaces'

import * as S from './styles'
import { MenuSwitch } from './header/components/menu/component'
import { Header } from './header'

export function Layout(props: ILayout) {
  return (
    <S.Layout $zIndex={zIndexInfinityForge.layoutDeSistemas}>
      <Header {...props} />

      <MenuSwitch />

      {props.children && <main>{props.children}</main>}
    </S.Layout>
  )
}
