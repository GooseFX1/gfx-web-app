import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useConnectionConfig, useDarkMode, usePriceFeedFarm, useSSLContext } from '../../context'
import { executeAllPoolClaim } from '../../web3'
import { truncateBigNumber } from '../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { TERMS_OF_SERVICE } from '../../constants'
import { Button, Dialog, DialogBody, DialogCloseDefault, DialogContent, DialogOverlay } from 'gfx-component-lib'
import { MIN_AMOUNT_CLAIM } from '@/pages/FarmV3/FarmTableComponents/FarmTableBalanceItem'
import useTransaction from '@/hooks/useTransaction'

export const AllClaimModal: FC<{
  allClaimModal: boolean
  setAllClaimModal: Dispatch<SetStateAction<boolean>>
  rewardsArray: Array<{ tokenName: string; reward: number }>
}> = ({ allClaimModal, setAllClaimModal, rewardsArray }) => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const { wallet } = useWallet()
  const { SSLProgram } = usePriceFeedFarm()
  const { connection } = useConnectionConfig()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { rewards, allPoolSslData } = useSSLContext()
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )

  const handleAllClaim = async () => {
    setIsLoading(true)
    const tx = await executeAllPoolClaim(SSLProgram, connection, pubKey, rewards, allPoolSslData)
    await sendTransaction(createTransactionBuilder().add(tx).getTransaction())
    setAllClaimModal(false)
    setIsLoading(false)
  }

  const Content = useMemo(
    () => (
      <>
        <h5 className="dark:text-grey-8 text-black-4 text-lg font-semibold mb-2.5">Claim All Yield</h5>
        <div className="dark:text-grey-2 text-grey-1 text-tiny font-semibold mb-4 font-sans">
          By claiming, you will get all pending yield available.
        </div>
        {rewardsArray &&
          rewardsArray.map((item, index) => {
            if (item.reward > MIN_AMOUNT_CLAIM) {
              return (
                <div key={index} className="flex flex-row justify-between mb-2.5">
                  <span className="text-regular font-semibold text-grey-1 dark:text-grey-2">
                    {item.tokenName} Pool
                  </span>
                  <span className="text-regular font-semibold text-black-4 dark:text-grey-8">
                    {truncateBigNumber(item.reward) + ' ' + item.tokenName}
                  </span>
                </div>
              )
            }
          })}
        <Button
          colorScheme={'blue'}
          onClick={handleAllClaim}
          isLoading={isLoading}
          fullWidth
          disabled={rewardsArray?.length == 0 || isLoading}
        >
          <span className="font-bold text-regular"> Claim All </span>
        </Button>
        <Button variant={'link'} colorScheme={'red'} fullWidth onClick={() => setAllClaimModal(false)}>
          Cancel
        </Button>
        <div className="text-regular dark:text-grey-2 text-grey-1 text-tiny font-semibold text-center">
          By claiming, you agree to our{' '}
          <a
            href={TERMS_OF_SERVICE}
            className="text-tiny font-semibold underline dark:text-white text-blue-1"
            target={'_blank'}
            rel={'noreferrer'}
          >
            Terms of Service
          </a>
          .
        </div>
      </>
    ),
    [breakpoint, mode, isLoading]
  )
  return (
    <Dialog open={allClaimModal} onOpenChange={setAllClaimModal}>
      <DialogOverlay />
      <DialogContent
        className={'p-2.5 w-full  sm:rounded-b-none'}
        placement={breakpoint.isMobile ? 'bottom' : 'default'}
      >
        <DialogCloseDefault />
        <DialogBody className={'w-full mx-auto flex-col'}>{Content}</DialogBody>
      </DialogContent>
    </Dialog>
  )
}
