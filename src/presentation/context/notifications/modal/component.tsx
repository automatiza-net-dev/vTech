import { useEffect, useRef, useState, forwardRef, ForwardedRef } from 'react'

import ReactDom from 'react-dom'

import { Error, Icon, disableScroll, zIndexInfinityForge } from 'infinity-forge'

import { ModalProps } from './interfaces'

import * as S from './styles'

export const Modal = forwardRef(
  (
    {
      open,
      styles,
      stylesContent,
      onClose,
      actions,
      children,
      hideCloseButton,
      closePortalOnCloseModal = true,
      isNotPossibleClose = false
    }: ModalProps,
    _: ForwardedRef<HTMLDivElement>,
  ) => {
    const [showPortal, setShowPortal] = useState(false)

    const refContainer = useRef<HTMLDivElement | null>(null)

    disableScroll(open)

    useEffect(() => {
      if (open && !showPortal) {
        setShowPortal(true)

        if (refContainer.current && !document.body.contains(refContainer.current)) {
          document.body.appendChild(refContainer.current)
        }
      }

      if (!open && showPortal) {
        setShowPortal(false)

        if (refContainer.current && document.body.contains(refContainer.current)) {
          document.body.removeChild(refContainer.current)
        }
      }
    }, [open])

    function closeModal() {
      if(isNotPossibleClose) {
        return;
      }
      
      closePortalOnCloseModal && setShowPortal(false)

      onClose(setShowPortal)
    }

    if (refContainer.current === null && process.browser) {
      refContainer.current = document.createElement('div')
      refContainer.current.classList.add('infinity_forge_modal')
      refContainer.current.style.zIndex = String(zIndexInfinityForge.modal)
    }

    return showPortal && refContainer.current ? (
      ReactDom.createPortal(
        <Error name='Modal'>
          <S.Modal>
            <div className='overlay' onClick={closeModal} style={{ zIndex: zIndexInfinityForge.modal }} />

            <div className='modal_content' style={{ ...styles, zIndex: zIndexInfinityForge.modal }}>
              {!hideCloseButton && (
                <button type='button' onClick={closeModal} className='close_modal_infinity_forge'>
                  <Icon name='IconClose' color='#000' />
                </button>
              )}

              <div className='content_modal_infinity_forge' style={stylesContent}>
                {children}

                {actions && <div className='actions_modal_infinity_forge'>{actions}</div>}
              </div>
            </div>
          </S.Modal>
        </Error>,
        refContainer.current,
      )
    ) : (
      <></>
    )
  },
)
