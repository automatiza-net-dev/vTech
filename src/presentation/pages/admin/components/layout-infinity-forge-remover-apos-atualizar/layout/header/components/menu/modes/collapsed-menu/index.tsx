import { useMenu, Error, Icon, useElementId, useWindow } from 'infinity-forge'

import { MenuItem } from '../../components/menu-item'

import * as S from './styles'

export function CollapsedMenu() {
  const { openMenu, setOpenMenu } = useMenu()
  const header = useElementId({ id: 'header' })

  const window = useWindow()
  const isMobile = window?.innerWidth <= 1024

  return (
    <Error name='CollapsedMenu'>
      <div style={{ width: isMobile ? 0 : 65, position: 'relative' }} id='ghost' className='ghost'>
        <S.CollapsedMenu
          style={{ height: `calc(100vh - ${header?.offsetHeight + 'px'})` }}
          id='sidebar'
          className={openMenu ? 'menu open' : 'menu'}
        >
          <button type='button' className='expand' onClick={() => setOpenMenu?.((s) => !s)}>
            <Icon name='IconRightChevron' />
          </button>

          {[
          {
            id: 1,
            title: "Dashboard",
            url: "/admin",
            route: "/admin",
          },
          {
            id: 2,
            title: "Colaboradores",
            url: "/admin/colaboradores",
            route: "/admin/colaboradores",
          },
          {
            id: 3,
            title: "Controles de acesso",
            url: "/admin/controles-de-acesso",
            route: "/admin/controles-de-acesso",
          },
        ]?.map((item, index) => (
            <ul key={item.id + (item?.route || "")}>
            
                <Error name={item.id + item.title + 'erro_menu_item'}>
                  <MenuItem key={'menu-item' + index + item.title} item={item} index={index} />
                </Error>
            </ul>
          ))}
        </S.CollapsedMenu>
      </div>
    </Error>
  )
}
