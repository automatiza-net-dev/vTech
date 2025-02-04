
import { Avatar, Error, Tooltip, useAuthAdmin } from 'infinity-forge'
import { Content } from './content'

import * as S from './styles'

export function Profile({ buttontext }: { buttontext?: string }) {
  const { user } = useAuthAdmin()

  const avatarImage = user?.avatar || '/images/default-profile.png'

  return (
    <Error name='Profile'>
      <S.Profile id='profile-btn'>
        <Tooltip
          idTooltip='Profile'
          bgColor='#fff'
          trigger={<Avatar image={avatarImage} buttonText={buttontext} />}
          enableArrow
          content={<Content />}
        />
      </S.Profile>
    </Error>
  )
}
