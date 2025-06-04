import React from 'react'

import TokenFeedGridSettings from '@/pages/TokenFeed/TokenFeedGridSettings'
import TokenFeedSocialPanel from '@/pages/TokenFeed/TokenFeedSocialPanel'
import TokenFeedNewTokenPanel from '@/pages/TokenFeed/TokenFeedNewTokenPanel'
import TokenFeedMigratedTokenPanel from '@/pages/TokenFeed/TokenFeedMigratedTokenPanel'
import { H2 } from '@/components/text/TextComponents'
import { cn } from 'gfx-component-lib'
import TokenFeedSoonTokenPanel from './TokenFeedSoonTokenPanel'
import TokenFeedQuickBuy from './TokenFeedQuickBuy'

function TokenFeed() {

  return (
    <div className={`flex flex-col flex‐1 overflow‐auto px-7.5 w-full`}>
      <div className={`flex flex-col w-full max-w-[1380px] gap-4 mx-auto`}>
        <div className={'inline-flex w-full justify-between'}>
          <H2>Trade</H2>
          <div className={'inline-flex gap-4'}>
            <TokenFeedQuickBuy/>
            <TokenFeedGridSettings />
          </div>
        </div>
        <div
          className={cn(`grid items-center justify-center justify-items-center gap-4 content-between
          grid-cols-[repeat(1,_minmax(450px,_1fr))] md:grid-cols-[repeat(2,_minmax(330px,_1fr))]
           lg:grid-cols-[repeat(3,_minmax(330px,_1fr))] 
       `)}
        >
          <TokenFeedSocialPanel />
          <TokenFeedNewTokenPanel />
          <TokenFeedMigratedTokenPanel />
          <TokenFeedSoonTokenPanel />
        </div>
      </div>
    </div>
  )
}

//
// function MobileDrawer() {
//   const [open, setOpen] = useBoolean(false);
//   const bind = useDrag(
//     (state) => {
//       const [, swipeY] = state.swipe
//       console.log("SWIPE",{swipeY, state})
//       // swipeY === -1 indicates a “swipe up” gesture
//       if (state.last && swipeY === -1) {
//         setOpen.on();
//       } else if (state.last && swipeY === 1) {
//         setOpen.off();
//       }
//     },{}
//   );
//   return (
//     <Dialog  open={true}>
//       <DialogPortal forceMount={true}>
//         {open && <DialogOverlay className={'z-[49]'}/>}
//         <DialogContent
//           className={
//           cn(`w-full h-max max-h-[100dvh] overflow-y-scroll rounded-b-none z-[100] animate transition-[height]
//            duration-300`,
//             open ? `h-screen` : `-translate-y-1/2`)
//         }
//           placement={'bottom'}
//           {...bind()}
//           style={{
//             touchAction: 'none',
//             zIndex: '50'
//           }}
//         >
//           <DialogHeader>Test</DialogHeader>
//           <DialogBody>TEST</DialogBody>
//           <DialogFooter>Test</DialogFooter>
//         </DialogContent>
//       </DialogPortal>
//     </Dialog>
//   )
// }
export default TokenFeed
