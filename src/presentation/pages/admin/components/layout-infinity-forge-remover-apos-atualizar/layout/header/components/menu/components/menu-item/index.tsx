import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Icon, useWindow, useAuthAdmin, useMenu } from 'infinity-forge'

import * as S from '../../styles'

export function MenuItem({ item, index }: { item: any; index: number }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const window = useWindow()
  const { openMenu, setOpenMenu } = useMenu()

  const path = router?.asPath.replace(/\/$/, '')
  const isActivePage = path === item?.route

  const hasMenuItems = item?.items && item.items?.length > 0

  const { roleUser } = useAuthAdmin()

  const isEnableToShowMenuItem = !item?.roles ? true : item?.roles?.includes(roleUser)

  if (!isEnableToShowMenuItem) {
    return <></>
  }

  function toggleMenuItem() {
    if (openMenu) {
      setOpen(false)
      setOpenMenu?.(false)
      return
    }

    if (window.innerHeight <= 1024) {
      setOpen(!open)
      return
    }
  }

  function ItemContent({ href }) {
    return (
      <span className='font-13-regular'>
        <div onClick={toggleMenuItem}>
          {item?.icon && <div className='icon' dangerouslySetInnerHTML={{ __html: item.icon }} />}

          <Link href={href || ''} className='content-title' target={item.target}>
            {item?.title}
          </Link>
        </div>

        {item?.items?.length > 0 && (
          <div onClick={toggleMenuItem} className='arrow'>
            <Icon name='IconRightChevron' />
          </div>
        )}
      </span>
    )
  }

  return (
    <li className={(open ? ' open' : '') + (isActivePage ? ' active-page' : '')}>
      {item.route ? <ItemContent href={item.route} /> : <ItemContent href={item.route} />}

      {hasMenuItems && <SubMenu key={'submenu' + item.title} index={index} item={item?.items} />}
    </li>
  )
}

function SubMenu({ item, index }: { item: any[]; index: number }) {
  const openAtTopLimit = index >= 7

  const openTopStyle = {
    top: 'auto',
    bottom: 0,
  }

  return (
    <S.SubMenu style={openAtTopLimit ? openTopStyle : {}} className='submenu' $index={index}>
      {item.map((subitem) => (
        <MenuItem key={'submenu-item' + subitem.title} item={subitem} index={index} />
      ))}
    </S.SubMenu>
  )
}
