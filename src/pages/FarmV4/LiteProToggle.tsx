// import { useConnectionConfig, useDarkMode, useRewardToggle } from '@/context'
// import {
//   cn,
//   Button,
//   Icon,
//   Dialog,
//   DialogOverlay,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogCloseDefault,
//   DialogBody
// } from 'gfx-component-lib'
// import { ReactElement, useCallback, useState } from 'react'
// import useBreakPoint from '@/hooks/useBreakPoint'

// export const LiteProToggle = (): ReactElement => {
//   const { isCardMode, setIsCardMode, setIsPortfolio } = useGamma()
//   const { mode } = useDarkMode()
//   const { isMobile } = useBreakPoint()
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const {userCache, updateUserCache} = useConnectionConfig();

//   const handleToggle = useCallback(() => {
//     if (isMobile) {
//       setIsDialogOpen(true)
//     } else {
//       setIsPortfolio.off()
//       setIsCardMode.toggle()
//       updateUserCache({
//         gamma: {
//           ...userCache.gamma,
//           viewMode: isCardMode ? 'card' : 'row'
//         }
//       })
//     }
//   }, [setIsPortfolio, setIsCardMode, isMobile, setIsDialogOpen])

//   const handleDialogClose = useCallback(() => {
//     setIsDialogOpen(false)
//   }, [setIsPortfolio, setIsCardMode])

//   return (
//     <>
//       <Button
//         className={cn(
//           `h-[30px] w-[75px] border-[1.5px] border-solid`,
//           isCardMode ? `dark:bg-gradient-5 bg-gradient-6 border-purple-3` : `bg-gradient-4 border-[#31E591]`
//         )}
//         variant={'secondary'}
//         onClick={handleToggle}
//       >
//         <Icon src={`img/assets/${isCardMode ? `pro_${mode}` : `lite_${mode}`}.svg`} alt="?-icon" size="sm" />
//         <div className="text-black-4 dark:text-white font-bold text-regular">{isCardMode ? 'PRO' : 'LITE'}</div>
//       </Button>

//       {isDialogOpen && (
//         <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
//           <DialogOverlay />
//           <DialogContent
//             className={`flex flex-col gap-0 h-[273px] border-1 border-solid
//         dark:border-border-darkmode-secondary border-border-lightmode-secondary max-sm:rounded-b-none z-[1001]`}
//             fullScreen={true}
//             placement={'bottom'}
//           >
//             <DialogHeader className={`px-2 py-3.5 flex items-center`}>
//               <DialogTitle className={'text-center'}>Pro Mode Coming Soon...</DialogTitle>
//               <DialogCloseDefault className={'top-1.5 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0'} />
//             </DialogHeader>
//             <DialogBody className={'flex flex-col p-2'}>
//               <div>
//                 <img src={`img/assets/pro_features_graphic_${mode}.svg`} alt="pro-icon" className={'w-full'} />
//               </div>
//               <p className={'text-center'}>
//                 Elevate your experience with Pro mode on desktop with advanced analytics and custom options.
//               </p>
//             </DialogBody>
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   )
// }
