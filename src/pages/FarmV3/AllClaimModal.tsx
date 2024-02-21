import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button, PopupCustom } from '../../components'
import { Drawer } from 'antd'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode, usePriceFeedFarm, useConnectionConfig } from '../../context'
import { executeAllPoolClaim } from '../../web3'
import { claimAllSuccess, sslErrorMessage, genericErrMsg } from './constants'
import { notify } from '../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

const STYLED_POPUP = styled(PopupCustom)`
  .ant-modal-content {
    ${tw`h-full dark:bg-black-2 bg-white rounded-bigger`}
  }
  .ant-modal-close-x {
    > img {
      ${tw`sm:!h-4 sm:!w-4 absolute bottom-2 opacity-60`}
    }
  }
  .ant-modal-body {
    ${tw`p-5 sm:p-[15px]`}
  }
`

export const AllClaimModal: FC<{
  allClaimModal: boolean
  setAllClaimModal: Dispatch<SetStateAction<boolean>>
  rewardsArray: Array<{ tokenName: string; rewardUSD: number }>
}> = ({ allClaimModal, setAllClaimModal, rewardsArray }) => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const elem = document.getElementById('farm-container')
  const { wallet } = useWallet()
  const wal = useWallet()
  const { SSLProgram } = usePriceFeedFarm()
  const { connection } = useConnectionConfig()

  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )

  const handleAllClaim = () => {
    try {
      executeAllPoolClaim(SSLProgram, wal, connection, pubKey).then((con) => {
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(claimAllSuccess())
        } else {
          notify(sslErrorMessage())
          return
        }
      })
    } catch (err) {
      notify(genericErrMsg(err))
    }
  }

  const Content = useCallback(
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
        <div tw="dark:text-grey-5 text-grey-1 text-lg font-semibold mb-3.75 sm:text-average">Claim all yield</div>
        {rewardsArray &&
          rewardsArray.map((item, index) => {
            if (item) {
              return (
                <div key={index} tw="flex flex-row justify-between mb-2.5">
                  <span>{item?.tokenName}</span>
                  <span>{item?.rewardUSD}</span>
                </div>
              )
            }
          })}
        <Button
          height="35px"
          cssStyle={tw`duration-500 w-[380px] sm:w-[100%] !h-10 bg-blue-1 text-regular border-none mx-auto my-3.75
                    !text-white font-semibold rounded-[50px] flex items-center justify-center outline-none`}
          onClick={handleAllClaim}
          loading={false}
          disabled={rewardsArray && !rewardsArray?.length}
          disabledColor={tw`dark:bg-black-1 bg-grey-5 !text-grey-1 opacity-70`}
        >
          Claim All
        </Button>
        <div
          tw="text-center text-red-2 font-bold text-regular cursor-pointer mb-2.5"
          onClick={() => setAllClaimModal(false)}
        >
          Cancel
        </div>
        <div tw="text-regular dark:text-grey-2 text-grey-1 text-tiny font-semibold text-center">
          By claiming, you agree to our Terms of Service.
        </div>
      </div>
    ),
    [breakpoint, mode]
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
      {Content()}
    </Drawer>
  ) : (
    <STYLED_POPUP
      height={'auto'}
      width={'400px'}
      title={null}
      centered={true}
      visible={allClaimModal ? true : false}
      onCancel={() => setAllClaimModal(false)}
      footer={null}
    >
      {Content()}
    </STYLED_POPUP>
  )
}
