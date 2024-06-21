import { Dispatch, FC, SetStateAction} from 'react'
import { Dialog, DialogBody, DialogCloseDefault, DialogContent, DialogOverlay } from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import { GeorestrictionBodyContent } from './GeorestrictionBodyContent'

export const GeorestrictionModal: FC<{
  geoBlocked: boolean
  setGeoBlocked: Dispatch<SetStateAction<boolean>>
}> = ({ geoBlocked, setGeoBlocked }) => {
  const breakpoint = useBreakPoint()

  return (
    <Dialog open={geoBlocked} onOpenChange={setGeoBlocked}>
      <DialogOverlay />
      <DialogContent
        className={'p-3 w-[400px] h-[336px] max-sm:rounded-b-none max-sm:rounded-t-small max-sm:w-full'}
        placement={breakpoint.isMobile ? 'bottom' : 'default'}
      >
        <DialogCloseDefault />
        <DialogBody className={'w-full mx-auto flex-col'}><GeorestrictionBodyContent /></DialogBody>
      </DialogContent>
    </Dialog>
  )
}
