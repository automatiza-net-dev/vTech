import { Fragment, useState } from 'react'

import Link from 'next/link'

import { InputSearch, Error, FormHandler, Icon, IconsNames } from 'infinity-forge'

import * as S from './styles'

export function SearchList({ setOpen }: { setOpen }) {
  const [searchText, setSearchText] = useState('')

  const filteredList = [
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
  ]?.filter((list) =>
    JSON.stringify(list).toLowerCase().includes(searchText.toLowerCase()),
  )

  return (
    <Error name='SearchList'>
      <S.SearchList>
        <div className='header'>
          <FormHandler>
            <InputSearch onChange={(value) => setSearchText(value)} />
          </FormHandler>

          <button className='close' type='button' onClick={() => setOpen(false)}>
            <Icon name='IconClose' />
          </button>
        </div>

        <div className='list'>
          {filteredList?.length === 0 ? (
            <div className='not-found'>
              <div className='icon'>
                <Icon name='IconNotFound' />
              </div>
              <p className='font-20-regular'>Nenhum resultado encontrado</p>
            </div>
          ) : (
            filteredList?.map((item, index) => (
              <Fragment key={item.title + '-' + index}>
                <h6 className={`font-12-bold uppercase ${index !== 0 && 'last'}`}>{item.title}</h6>

                {filteredList[index].route && (
                  <Link href={filteredList[index].route} key={filteredList[index].title} className='item'>
                    {/* <div className='icon'>
                      <Icon name={filteredList[index].icon as IconsNames} />
                    </div> */}
                    <span className='text-box font-14-regular'>
                      <span className='name'>{filteredList[index].title}</span>
                      <span className='href'>{filteredList[index].route}</span>
                    </span>
                  </Link>
                )}

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
  ]?.map((subItem) =>
                  subItem.route ? (
                    <Link href={subItem.route} key={subItem.title} className='item'>
                      {/* <div className='icon'>
                        <Icon name={subItem.icon as IconsNames} />
                      </div> */}
                      <span className='text-box font-14-regular'>
                        <span className='name'>{subItem.title}</span>
                        <span className='href'>{subItem.route}</span>
                      </span>
                    </Link>
                  ) : null,
                )}
              </Fragment>
            ))
          )}
        </div>
      </S.SearchList>
    </Error>
  )
}
