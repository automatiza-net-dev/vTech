
import { Error, useAuthAdmin } from 'infinity-forge'
import * as S from './styles'

export function Content() {
  const { user, signOut } = useAuthAdmin()

  return (
    <Error name='Content'>
      <S.Content>
        <div className='user-profile'>
          <div className='user-info'>
            <h6 className='font-16-semibold'>{user?.firstName}</h6>

            <p className='font-14-regular email'>{user?.emailAddress}</p>
          </div>
        </div>

        <div className='divider'>
          <button
            className='sign-out-button font-14-regular'
            type='button'
            onClick={() => signOut()}
          >
            Sair
          </button>
        </div>
      </S.Content>
    </Error>
  )
}
