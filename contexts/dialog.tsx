'use client'

import { DialogComposition, type DialogProps } from '@/components/compositions/dialog'
import { createContext, useContext, useRef, type ReactNode, type RefObject } from 'react'

interface DialogContextProps {
  dialog: RefObject<DialogProps>
}

const DialogContext = createContext({} as DialogContextProps)

export function useDialogContext() {
  const context = useContext(DialogContext)
  return context
}

export function DialogContextRoot({ children }: { children: ReactNode }) {
  const dialog = useRef<DialogProps>(null)
  return (
    <DialogContext.Provider value={{ dialog }}>
      {children}
      <DialogComposition ref={dialog} />
    </DialogContext.Provider>
  )
}
