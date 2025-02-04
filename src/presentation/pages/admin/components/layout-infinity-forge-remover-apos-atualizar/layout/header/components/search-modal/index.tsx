import { useState } from 'react'

import { Error, Modal } from 'infinity-forge'
import { SearchTrigger } from './trigger'
import { SearchList } from './search-list'

import * as S from './styles'

export function SearchModal() {
  const [open, setOpen] = useState(false)

  return (
    <Error name='SearchModal'>
      <S.SearchModal>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          stylesContent={{
            padding: 0,
          }}
          hideCloseButton
          styles={{ width: '100vw', maxWidth: '512px', borderRadius: 10, padding: 0, overflow: 'hidden' }}
        >
          <SearchList setOpen={setOpen} />
        </Modal>

        <SearchTrigger onClick={() => setOpen(true)} />
      </S.SearchModal>
    </Error>
  )
}
