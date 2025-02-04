import { Error, Icon, Tooltip } from 'infinity-forge'

import { Content } from './content'

import * as S from './styles'
import { ActionBox } from '../styles'

export function Messages() {
  return (
    <Error name='Messages'>
      <S.Messages id='messages-btn'>
        <Tooltip
          idTooltip='Messages'
          enableArrow
          bgColor='#fff'
          enableHover
          content={<Content />}
          trigger={
            <ActionBox >
              {/* {hasUnreadMessage && <div className='circle' />} */}

              <Icon name='IconFullFieldChat' />
            </ActionBox>
          }
        />
      </S.Messages>
    </Error>
  )
}
