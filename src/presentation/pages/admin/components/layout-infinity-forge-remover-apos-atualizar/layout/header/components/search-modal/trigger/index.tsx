import { Error, Icon } from 'infinity-forge'

import * as S from './styles'

export function SearchTrigger(props) {
  return (
    <Error name='SearchTrigger'>
      <S.SearchTrigger aria-label='Search' {...props}>
        <div className='icon'>
          <Icon name='LupaIcon' />
        </div>

        <span className='placeholder font-14-regular'>Pesquisar...</span>
      </S.SearchTrigger>
    </Error>
  )
}
