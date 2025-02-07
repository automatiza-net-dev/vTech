import Link from 'next/link'

import { Error } from 'infinity-forge'

import { ILayout } from '../../../interfaces'

export function Logo({ logo }: { logo: ILayout['logo'] }) {
  console.log(logo?.src)
  return (
    <Error name='logo'>
      <Link className='logo' href={logo?.href || '/'}>
        <img src={logo?.src} alt='header-logo' />
      </Link>
    </Error>
  )
}
