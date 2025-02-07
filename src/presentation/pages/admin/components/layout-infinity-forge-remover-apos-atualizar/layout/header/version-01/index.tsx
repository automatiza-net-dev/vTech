import { Container, Error, useWindow } from 'infinity-forge'
import { useMenu } from 'infinity-forge'

import { Logo, MenuRight, SearchModal } from '../components'

import { ILayout } from '../../interfaces'

import * as S from './styles'

export function HeaderVersion01({ workspaces, logo }: ILayout) {
  const { settings, setOpenMenu } = useMenu()
  
  const window = useWindow()
  const isMobile = window?.innerWidth <= 1024

  const showHamburger = isMobile && settings?.mode === 'OpenedMenu'

  return (
    <Error name='HeaderCarbon'>
      <S.HeaderVersion01 id='header'>
        <Container>
          <div className='left'>
            <div className='logo-wrapper'>
              <Logo logo={logo} />
            </div>
          </div>

          <div className='right'>
            {showHamburger && (
              <Error name='open_menu_button'>
                <button className='open_menu' onClick={() => setOpenMenu?.(true)} type='button'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5'
                    ></path>
                  </svg>
                </button>
              </Error>
            )}

            <Error name='search_modal'>
              <SearchModal />
            </Error>

            <Error name='menu-right'>
              <MenuRight workspaces={workspaces as any} />
            </Error>
          </div>
        </Container>
      </S.HeaderVersion01>
    </Error>
  )
}
