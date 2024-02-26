import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button, PopupCustom } from '../../components'
import { Drawer } from 'antd'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode, usePriceFeedFarm, useConnectionConfig, useSSLContext } from '../../context'
import { executeAllPoolClaim } from '../../web3'
import { claimAllSuccess, sslErrorMessage, genericErrMsg } from './constants'
import { notify, truncateBigNumber } from '../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { TERMS_OF_SERVICE } from '../../constants'

const STYLED_POPUP = styled(PopupCustom)`
  .ant-modal-content {
    ${tw`h-full dark:bg-black-2 bg-white rounded-[10px]`}
  }

  .ant-modal-close {
    ${tw`right-[10px] top-[10px]`}

    .ant-modal-close-x {
      ${tw`!h-[18px] !w-[18px] sm:!h-4 sm:!w-4`}
    }
  }

  .ant-modal-body {
    ${tw`p-2.5 sm:p-[15px]`}
  }
  .tos {
    ${tw`text-tiny font-semibold underline dark:text-white text-blue-1`}
  }
`

export const AllClaimModal: FC<{
  allClaimModal: boolean
  setAllClaimModal: Dispatch<SetStateAction<boolean>>
  rewardsArray: Array<{ tokenName: string; reward: number }>
}> = ({ allClaimModal, setAllClaimModal, rewardsArray }) => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const elem = document.getElementById('farm-container')
  const { wallet } = useWallet()
  const wal = useWallet()
  const { SSLProgram } = usePriceFeedFarm()
  const { connection } = useConnectionConfig()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { rewards, allPoolSslData } = useSSLContext()

  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )

  const handleAllClaim = () => {
    try {
      setIsLoading(true)
      executeAllPoolClaim(SSLProgram, wal, connection, pubKey, rewards, allPoolSslData).then((con) => {
        const { confirm } = con
        setIsLoading(false)
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(claimAllSuccess())
          setAllClaimModal(false)
        } else {
          notify(sslErrorMessage())
          setAllClaimModal(false)
          return
        }
      })
    } catch (err) {
      setIsLoading(false)
      notify(genericErrMsg(err))
    }
  }

  const Content = useMemo(
    () => (
      <div>
        {breakpoint.isMobile && (
          <div
            tw="absolute right-[25px] text-[25px] cursor-pointer"
            onClick={() => {
              setAllClaimModal(false)
            }}
          >
            <img key={`close-mobile-button`} src={`/img/mainnav/close-thin-${mode}.svg`} alt="close-icon" />
          </div>
        )}
        <h5 tw="dark:text-grey-8 text-black-4 text-lg font-semibold mb-2.5">Claim all yield</h5>
        <div tw="dark:text-grey-2 text-grey-1 text-tiny font-semibold mb-4 font-sans">
          By claiming, you will get all pending yield available.
        </div>
        {rewardsArray &&
          rewardsArray.map((item, index) => {
            if (item && item?.reward && item?.tokenName) {
              return (
                <div key={index} tw="flex flex-row justify-between mb-2.5">
                  <span tw="text-regular font-semibold text-grey-1 dark:text-grey-2">{item?.tokenName} Pool</span>
                  <span tw="text-regular font-semibold text-black-4 dark:text-grey-8">
                    {truncateBigNumber(item?.reward) + ' ' + item?.tokenName}
                  </span>
                </div>
              )
            }
          })}
        <Button
          height="35px"
          cssStyle={tw`duration-500 w-[380px] sm:w-[100%] !h-10 bg-blue-1 text-regular border-none mx-auto my-3.75
                    !text-white font-semibold rounded-[50px] flex items-center justify-center outline-none`}
          onClick={handleAllClaim}
          loading={isLoading}
          disabled={rewardsArray && !rewardsArray?.length}
          disabledColor={tw`dark:bg-black-1 bg-grey-5 !text-grey-1 opacity-70`}
        >
          <span tw="font-bold text-regular"> Claim All </span>
        </Button>
        <div
          tw="text-center text-red-2 font-bold text-regular cursor-pointer mb-2.5"
          onClick={() => setAllClaimModal(false)}
        >
          Cancel
        </div>
        <div tw="text-regular dark:text-grey-2 text-grey-1 text-tiny font-semibold text-center">
          By claiming, you agree to our{' '}
          <a href={TERMS_OF_SERVICE} target={'_blank'} rel={'noreferrer'} className="tos">
            Terms of Service
          </a>
          .
        </div>
      </div>
    ),
    [breakpoint, mode, isLoading]
  )

  return breakpoint.isMobile ? (
    <Drawer
      title={null}
      placement="bottom"
      closable={false}
      key="bottom"
      open={allClaimModal}
      getContainer={elem}
      maskClosable={true}
      height="auto"
      destroyOnClose={true}
      className={'gfx-drawer'}
    >
      {Content}
    </Drawer>
  ) : (
    <STYLED_POPUP
      height={'auto'}
      width={'400px'}
      title={null}
      centered={true}
      closeIcon={<img key={`close-mobile-button`} src={`/img/assets/close-${mode}.svg`} alt="close-icon" />}
      visible={allClaimModal ? true : false}
      onCancel={() => setAllClaimModal(false)}
      footer={null}
    >
      {Content}
    </STYLED_POPUP>
  )
}
