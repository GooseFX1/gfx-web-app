import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useReferrals from '../../hooks/useReferrals'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig, useCrypto } from '../../context'
import { getTraderRiskGroupAccount } from '../../pages/TradeV3/perps/utils'
import { notify } from '../../utils'
import { Notification } from '../../context/rewardsContext'
import { Transaction } from '@solana/web3.js'
import { Connect } from '../../layouts'
import { Loader } from '../Loader'
import tw from 'twin.macro'
import 'styled-components/macro'
const BuddyLinkReferral: FC = () => {
  const [isCopied, setIsCopied] = useState(false)
  const [name, setName] = useState('')
  const [initialFetch, setInitialFetch] = useState(true)
  const [riskGroup, setRiskGroup] = useState(null)
  const [loading, setLoading] = useState(false)
  const { createRandomBuddy, getName, isReady } = useReferrals()
  const wallet = useWallet()
  const { perpsDevnetConnection, perpsConnection } = useConnectionConfig()
  const { isDevnet } = useCrypto()

  const connection = useMemo(() => {
    if (isDevnet) return perpsDevnetConnection
    return perpsConnection
  }, [isDevnet])

  const referLink = useMemo(() => `app.goosefx.io/?r=${name}`, [name])

  useMemo(() => {
    if (connection && wallet.publicKey)
      getTraderRiskGroupAccount(wallet.publicKey, connection).then((result) => {
        setRiskGroup(result)
      })
  }, [connection, wallet])

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

        await connection.confirmTransaction(await wallet.sendTransaction(transaction, connection)).then(() => {
          notify({
            message: Notification(
              'Success!',
              false,
              'Your personal link has been generated. Share this magic link with others to start earning!'
            ),
            type: 'success'
          })
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
              <a css={[tw`mx-1 underline`]} href={'https://docs.goosefx.io/'} target={'_blank'} rel={'noreferrer'}>
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
          css={[
            tw`text-sm mb-0 text-[13px] leading-[16px] min-md:text-[18px] min-md:leading-[22px] text-black-1
     dark:text-grey-5`
          ]}
        >
          Generate your referral link
        </p>
        <button
          css={[
            tw`border-0 bg-grey-4 dark:bg-black-1 rounded-[72px] h-[30px] w-[94px] text-grey-2 font-semibold`,
            riskGroup
              ? tw`bg-blue-1 dark:bg-blue-1 text-white dark:text-white`
              : tw`text-grey-2 dark:text-grey-2 bg-grey-4 dark:bg-black-1`
          ]}
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
          css={[
            tw`text-sm mb-0 text-[13px] leading-[16px] min-md:text-[18px] min-md:leading-[22px] text-black-1
     dark:text-grey-5`
          ]}
        >
          app.goosefx.io/?r={name}
        </p>

        <button
          css={[
            tw`border-0 bg-grey-4 dark:bg-black-1 rounded-[72px] h-[30px] w-[94px] text-grey-2 font-semibold`,
            referLink
              ? tw`bg-blue-1 dark:bg-blue-1 text-white dark:text-white`
              : isCopied
              ? tw`text-grey-2 dark:text-grey-2 bg-grey-4 dark:bg-black-1`
              : tw``
          ]}
          disabled={!referLink}
        >
          {referLink ? `${isCopied ? 'Copied' : 'Copy'}` : 'Save'}
        </button>
      </>
    ),
    [isCopied, referLink, name]
  )

  return (
    <div css={tw`flex flex-col gap-5 min-h-[40px] min-md:mt-2.5 items-center `}>
      {!initialFetch ? (
        <>
          <div
            onClick={copyToClipboard}
            css={[
              tw`border-[1.5px] dark:border-grey-1 border-grey-2  border-dashed cursor-pointer
  flex flex-row  justify-between p-[5px] pl-[15px] items-center w-full rounded-[100px] relative h-10`,
              !name.trim() ? tw`cursor-default` : tw`cursor-pointer`
            ]}
          >
            {!name ? generateLink : copyLink}
          </div>
        </>
      ) : !wallet.connected ? (
        <Connect
          customButtonStyle={[
            tw`px-7.5 min-md:px-8 text-regular leading-normal text-white font-semibold w-[330px] min-md:w-[265px] h-10`
          ]}
        />
      ) : (
        <div css={[tw`relative`]}>
          <Loader zIndex={1} />
        </div>
      )}
    </div>
  )
}

export default BuddyLinkReferral
