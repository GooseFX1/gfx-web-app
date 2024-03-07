import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useReferrals from '../../hooks/useReferrals'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from '../../context'
import { getTraderRiskGroupAccount } from '../../pages/TradeV3/perps/utils'
import { notify } from '../../utils'
import { Notification } from '../../context/rewardsContext'
import { Transaction } from '@solana/web3.js'
import { Connect } from '../../layouts'
import { Loader } from '../Loader'
import { sendPerpsTransaction } from '../../web3/connection'
import { Button, cn } from 'gfx-component-lib'

const BuddyLinkReferral: FC = () => {
  const [isCopied, setIsCopied] = useState(false)
  const [name, setName] = useState('')
  const [initialFetch, setInitialFetch] = useState(true)
  const [riskGroup, setRiskGroup] = useState(null)
  const [loading, setLoading] = useState(false)
  const { createRandomBuddy, getName, isReady } = useReferrals()
  const { wallet } = useWallet()
  const wal = useWallet()
  const { perpsConnection: connection } = useConnectionConfig()
  const referLink = useMemo(() => `app.goosefx.io/?r=${name}`, [name])

  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const connected = useMemo(() => wallet?.adapter?.connected, [wallet?.adapter, wallet?.adapter?.connected])

  useMemo(() => {
    if (connection && connected) {
      getTraderRiskGroupAccount(publicKey, connection).then((result) => {
        setRiskGroup(result)
      })
    }
  }, [connection, publicKey])

  const copyToClipboard = useCallback(() => {
    if (!name || !name.trim()) return
    navigator.clipboard.writeText(referLink)
    setIsCopied(true)
    notify({
      type: 'success',
      message: Notification('Success!', false, 'Link successfully copied to the clipboard. Share away!')
    })
    setTimeout(() => {
      setIsCopied(false)
    }, 5000)
  }, [referLink])

  const handleCreateBuddy = useCallback(async () => {
    if (isReady && riskGroup) {
      try {
        setLoading(true)
        const transaction = new Transaction()

        // No referrer here because we can't attach it to the TraderRiskGroup
        transaction.add(...(await createRandomBuddy('')))

        //await connection.confirmTransaction(await wallet.sendTransaction(transaction, connection)).then(() => {
        const res = await sendPerpsTransaction(connection, wal, transaction, [])
        console.log('res: ', res)
        notify({
          message: Notification(
            'Success!',
            false,
            'Your personal link has been generated. Share this magic link with others to start earning!'
          ),
          type: 'success'
        })

        setName((await getName()) || '')
      } catch (e) {
        console.log(e)
        notify({
          message: Notification(
            "We can't do that!",
            true,
            <div>
              Please bear with us and try again, or if the error continues
              <a
                className={`mx-1 underline`}
                href={'https://docs.goosefx.io/'}
                target={'_blank'}
                rel={'noreferrer'}
              >
                go to docs
              </a>
            </div>
          ),
          type: 'error'
        })
        //TODO: handle error state
      } finally {
        setLoading(false)
      }

      // TODO: handle ui success state
    }
  }, [isReady, connection, riskGroup])

  const handleName = useCallback(async () => {
    if (isReady) {
      setName((await getName()) || '')
      setInitialFetch(false)
    }
  }, [isReady])

  useEffect(() => {
    if (isReady) handleName()
  }, [isReady])

  const generateLink = useMemo(
    () => (
      <>
        <p
          className={`text-sm mb-0 text-[13px] leading-[16px] min-md:text-[18px] min-md:leading-[22px] text-black-1
     dark:text-grey-5`}
        >
          Generate your referral link
        </p>
        <button
          className={cn(
            `border-0 bg-grey-4 dark:bg-black-1 rounded-[72px] h-[30px] w-[94px] text-grey-2 font-semibold`,
            riskGroup
              ? `bg-blue-1 dark:bg-blue-1 text-white dark:text-white`
              : `text-grey-2 dark:text-grey-2 bg-grey-4 dark:bg-black-1`
          )}
          onClick={handleCreateBuddy}
          disabled={!riskGroup}
        >
          {loading ? 'Loading...' : 'Generate'}
        </button>
      </>
    ),
    [riskGroup, name]
  )

  const copyLink = useMemo(
    () => (
      <>
        <p
          className={`text-sm mb-0 text-[13px] leading-[16px] min-md:text-[18px] min-md:leading-[22px] text-black-1
     dark:text-grey-5`}
        >
          app.goosefx.io/?r={name}
        </p>

        <Button
          variant={'ghost'}
          className={cn(
            `border-0  rounded-[72px] p-0  font-semibold`,
            referLink
              ? `text-text-blue dark:text-white`
              : isCopied
              ? `text-grey-2 dark:text-grey-2 bg-grey-4 dark:bg-black-1`
              : ``
          )}
          disabled={!referLink}
        >
          {referLink ? `${isCopied ? 'Copied' : 'Copy'}` : 'Save'}
        </Button>
      </>
    ),
    [isCopied, referLink, name]
  )

  return (
    <div className={`flex flex-col gap-5 min-h-[40px] items-center relative justify-center `}>
      {!initialFetch ? (
        <div
          onClick={copyToClipboard}
          className={cn(
            `border-[1.5px] dark:border-grey-1 border-grey-2 border-solid cursor-pointer
              flex flex-row justify-between p-[5px] px-2.5 items-center w-full rounded-[3px] 
              relative h-10`,
            !name.trim() ? `cursor-default` : `cursor-pointer`
          )}
        >
          {!name ? generateLink : copyLink}
        </div>
      ) : !publicKey && !connected ? (
        <Connect
          containerStyle={`w-full min-md:w-full h-[40px] rounded-[100px]`}
          customButtonStyle={`w-full min-md:w-full max-w-full h-[40px] min-md:h-[40px]`}
        />
      ) : (
        <div className={`absolute`}>
          <Loader zIndex={1} />
        </div>
      )}
    </div>
  )
}

export default BuddyLinkReferral
