import React, { FC, ReactNode, useCallback, useEffect, useRef } from 'react'
import tw from 'twin.macro'
import 'styled-components/macro'
import { TWIN_MACRO_ANIMATIONS } from '../../constants'
interface ModalWrapperProps {
  zIndex: number
  children: ReactNode
  align?: 'left' | 'center' | 'right' | 'top'
  justify?: 'start' | 'center' | 'between' | 'around' | 'evenly'
}

const ModalWrapper: FC<ModalWrapperProps> = ({ children, zIndex, align = 'center', justify = 'center' }) => (
  <div
    css={tw`fixed w-screen h-screen flex inset-0 flex`}
    style={{ zIndex, alignItems: align, justifyContent: justify }}
  >
    {children}
  </div>
)
export interface ModalProps {
  zIndex?: number
  disableClickOutside?: boolean
  disableBackdrop?: boolean
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  align?: 'left' | 'center' | 'right' | 'top'
  justify?: 'start' | 'center' | 'between' | 'around' | 'evenly'
  modalAnimation?: string
}

const Modal: FC<ModalProps> = ({
  zIndex = 10,
  isOpen,
  onClose,
  disableClickOutside = false,
  disableBackdrop,
  children,
  align,
  justify,
  modalAnimation
}) => {
  const modalRef = useRef(null)
  const clickOutside = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isOpen) return
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && !disableClickOutside) {
        onClose()
      }
    },
    [modalRef.current, onClose, disableClickOutside, isOpen]
  )
  useEffect(() => {
    document.addEventListener('mousedown', clickOutside)
    document.addEventListener('touchend', clickOutside)
    return () => {
      document.removeEventListener('mousedown', clickOutside)
      document.removeEventListener('touchend', clickOutside)
    }
  }, [clickOutside])
  if (!isOpen) return null
  return (
    <ModalWrapper zIndex={zIndex} align={align} justify={justify}>
      {!disableBackdrop && (
        <div
          css={[
            tw`opacity-70 fixed w-screen h-screen bg-gray-3 dark:bg-black
        bg-opacity-50 z-10`
          ]}
        />
      )}
      <div
        css={modalAnimation && TWIN_MACRO_ANIMATIONS[modalAnimation]}
        style={{ zIndex: zIndex + 1 }}
        ref={modalRef}
      >
        {children}
      </div>
    </ModalWrapper>
  )
}

export default Modal
