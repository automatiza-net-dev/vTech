import { useState } from 'react'


import { IWarningProps } from './interface'

import * as S from './styles'
import { Icon, LoaderCircle, Modal } from 'infinity-forge'

export function Warning({ onCancel, onConfirm, button, warningTitle, warningDescription, ...rest }: IWarningProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleCancel() {
    if (onCancel) {
      ;(async () => {
        try {
          setLoading(true)
          await onCancel()
          setOpen(false)
        } catch (err) {
        } finally {
          setLoading(false)
        }
      })()
    } else {
      setOpen(false)
    }
  }

  async function handleConfirm() {
    if (onConfirm) {
      try {
        setLoading(true)
        await onConfirm()
        setOpen(false)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }
  }

  function WarningComponent() {
    return (
      <S.Warning>
        <div className='warning_icon'>
          <Icon name='IconExclamation' color='#d5182e' />
        </div>

        {warningTitle && (
          <h3 className='font-18-bold'>{warningTitle || 'Você tem certeza que deseja excluir este registro?'}</h3>
        )}

        {warningDescription && (
          <p className='font-16-regular'>
            {warningDescription || 'Você não poderá recuperar este registro após excluir!'}
          </p>
        )}

        <div className='actions_warning'>
          {handleCancel && (
            <button type='button' onClick={handleCancel} className='cancel font-16-regular'>
              Não
            </button>
          )}

          {handleConfirm && (
            <button type='button' onClick={handleConfirm} className='confirm font-16-regular'>
              {loading ? <LoaderCircle size={20} color='#fff' /> : 'Sim'}
            </button>
          )}
        </div>
      </S.Warning>
    )
  }

  if (!button) {
    return <WarningComponent />
  }

  return (
    <>
      {button.Element && (
        <button style={{ background: 'none', padding: '0', border: 'none' }} onClick={() => setOpen(true)}>
          <button.Element />
        </button>
      )}

      <Modal {...rest} open={open} onClose={() => setOpen(false)}>
        <WarningComponent />
      </Modal>
    </>
  )
}
