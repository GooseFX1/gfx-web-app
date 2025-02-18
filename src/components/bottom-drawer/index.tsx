import useBreakPoint from '@/hooks/useBreakPoint'
import { Dialog, DialogBody, DialogContent, DialogOverlay } from 'gfx-component-lib'

export const BottomDrawer = ({
  isOpen,
  setOpen,
  children
}: {
  isOpen: boolean
  setOpen: (b: boolean) => void
  children: React.ReactNode
}) => {
  const breakpoint = useBreakPoint()
  const isMobile = breakpoint.isMobile
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open)
      }}
    >
      <DialogOverlay />
      <DialogContent
        className={`w-full h-max max-h-[100dvh] overflow-y-scroll rounded-b-none 
          `}
        fullScreen={!isMobile}
        placement={'bottom'}
      >
        <DialogBody
          className={`bg-white dark:bg-black-2 relative min-md:min-h-[441px]
           w-full flex flex-row max-md:flex-col rounded-t-[10px]`}
        >
          {children}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
