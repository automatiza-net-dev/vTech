
import { Error, HighlightText } from 'infinity-forge'
import { IMessage } from './interfaces'

import * as S from './styles'

export function MessageCard({ title, status, date, name, description, url }: IMessage) {
  return (
    <Error name='MessageCard'>
      <S.MessageCard href={url}>
        <div className='top'>
          <h5 className='title font-16-bold'>{title}</h5>

          <HighlightText {...status} />

          <span className='days font-12-regular'>{date}</span>
        </div>

        <p className='description font-16-regular'>
          <strong className='-bold'>{name}: </strong> {description}
        </p>
      </S.MessageCard>
    </Error>
  )
}
