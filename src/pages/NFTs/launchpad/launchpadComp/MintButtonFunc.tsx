import styled from 'styled-components'
import { CandyMachineAccount } from '../candyMachine/candyMachine'
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import { useEffect, useState, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  findGatewayToken,
  getGatewayTokenAddressForOwnerAndGatekeeperNetwork,
  onGatewayTokenChange,
  removeAccountChangeListener
} from '@identity.com/solana-gateway-ts'
import { useConnectionConfig } from '../../../../context'
import { Share } from '../../Share'
import { copyToClipboard } from '../../Collection/CollectionHeader'
import { Connect } from '../../../../layouts/App/Connect'

const MINT_BUTTON_BAR = styled.div`
  @media (max-width: 500px) {
    margin-top: 0px;
    border-radius: 15px 15px 0 0;
    width: 100% !important;
    justify-content: space-evenly;
    min-width: 300px;
    align-items: center;
    position: fixed;
    bottom: 0;
  }
  margin-top: -100px;
  height: 70px;
  z-index: 99;
  min-width: 650px;
  width: 35vw !important;
  max-width: 800px;
  border-top: 1px solid ${({ theme }) => theme.tableBorder};
  position: relative;
  border-radius: 0 0 25px 25px;
  display: flex;
  backdrop-filter: blur(23.9091px);
  background-color: ${({ theme }) => theme.bg9} !important;
`
const SHARE_BTN = styled.div`
  margin-top: 10px;
  margin-right: 10px;
  cursor: pointer;
  @media (max-width: 500px) {
    margin: 0;
  }
`
const MINT_BTN = styled.div<{ active: boolean }>`
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 47px;
  width: 260px;
  height: 50px;
  margin: auto;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  justify-content: center;
  cursor: ${({ active }) => (!active ? 'not-allowed' : 'pointer')};
  @media (max-width: 500px) {
    margin: 0;
    z-index: 100;
    justify-content: center;
  }
`
const WHITELIST_SPOTS = styled.div`
  position: absolute;
  left: 50px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CONNECT_WRAPPER = styled.div`
  @media (max-width: 500px) {
    margin: 0;
  }
  margin: auto;
  > button {
    width: 260px;
    height: 50px;
    background: #6b33b0;
  }
`

export const MintButtonFunc = ({
  onMint,
  candyMachine,
  isMinting,
  setIsMinting,
  isActive,
  isLive,
  isWhitelist,
  cndyValues
}: {
  onMint: () => Promise<void>
  candyMachine?: CandyMachineAccount
  isMinting: boolean
  setIsMinting: (val: boolean) => void
  isActive: boolean
  isLive: boolean
  isWhitelist: boolean
  cndyValues: any
}) => {
  const wallet = useWallet()
  const [verified, setVerified] = useState(false)
  const { requestGatewayToken, gatewayStatus } = useGateway()
  const [webSocketSubscriptionId, setWebSocketSubscriptionId] = useState(-1)
  const [clicked, setClicked] = useState(false)
  const [visible, setVisible] = useState(false)
  const onShare = async (social: string) => {
    if (social === 'copy link') {
      copyToClipboard()
      return
    }
  }
  const handleShareClick = () => {
    if (visible) {
      return (
        <Share
          visible={visible}
          handleCancel={() => setVisible(false)}
          socials={['twitter', 'telegram', 'facebook', 'copy link']}
          handleShare={onShare}
        />
      )
    }
  }

  const { connection } = useConnectionConfig()

  const getWhitelistSpots = () => {
    if (
      cndyValues &&
      cndyValues.whitelistInfo &&
      cndyValues.whitelistInfo.numberOfWhitelistSpotsPerUser.toString() > 0
    )
      return cndyValues.whitelistInfo.numberOfWhitelistSpotsPerUser.toString()
    return null
  }

  const getMintButtonContent = () => {
    if (candyMachine?.state.isSoldOut) {
      return 'SOLD OUT'
    } else if (isMinting) {
      return 'MINTING'
    } else if (candyMachine?.state.isWhitelistOnly) {
      return 'WHITELIST MINT'
    }
    if (isWhitelist) {
      if (
        cndyValues &&
        cndyValues.whitelistInfo &&
        cndyValues.whitelistInfo.numberOfWhitelistSpotsPerUser.toString() > 0
      ) {
        return 'MINT'
      } else {
        return 'MINT'
      }
    }

    return 'MINT'
  }

  useEffect(() => {
    const mint = async () => {
      await removeAccountChangeListener(connection, webSocketSubscriptionId)
      await onMint()

      setClicked(false)
      setVerified(false)
    }
    if (verified && clicked) {
      mint()
    }
  }, [verified, clicked, connection, onMint, webSocketSubscriptionId])

  const previousGatewayStatus = usePrevious(gatewayStatus)
  useEffect(() => {
    const fromStates = [GatewayStatus.NOT_REQUESTED, GatewayStatus.REFRESH_TOKEN_REQUIRED]
    const invalidToStates = [...fromStates, GatewayStatus.UNKNOWN]
    if (
      fromStates.find((state) => previousGatewayStatus === state) &&
      !invalidToStates.find((state) => gatewayStatus === state)
    ) {
      setIsMinting(true)
    }
  }, [setIsMinting, previousGatewayStatus, gatewayStatus])

  return (
    <MINT_BUTTON_BAR>
      {handleShareClick()}
      {isLive && wallet.wallet ? (
        <>
          <MINT_BTN
            active={!isMinting && isActive}
            onClick={async () => {
              if (candyMachine?.state.isActive && candyMachine?.state.gatekeeper) {
                const network = candyMachine.state.gatekeeper.gatekeeperNetwork.toBase58()
                if (network === 'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6') {
                  if (gatewayStatus === GatewayStatus.ACTIVE) {
                    await onMint()
                  } else {
                    await requestGatewayToken()
                  }
                } else if (
                  network === 'ttib7tuX8PTWPqFsmUFQTj78MbRhUmqxidJRDv4hRRE' ||
                  network === 'tibePmPaoTgrs929rWpu755EXaxC7M3SthVCf6GzjZt'
                ) {
                  setClicked(true)
                  const gatewayToken = await findGatewayToken(
                    connection,
                    wallet.publicKey,
                    candyMachine.state.gatekeeper.gatekeeperNetwork
                  )

                  if (gatewayToken?.isValid()) {
                    await onMint()
                  } else {
                    window.open(`https://verify.encore.fans/?gkNetwork=${network}`, '_blank')

                    const gatewayTokenAddress = await getGatewayTokenAddressForOwnerAndGatekeeperNetwork(
                      wallet.publicKey,
                      candyMachine.state.gatekeeper.gatekeeperNetwork
                    )

                    setWebSocketSubscriptionId(
                      onGatewayTokenChange(connection, gatewayTokenAddress, () => setVerified(true), 'confirmed')
                    )
                  }
                } else {
                  setClicked(false)
                  throw new Error(`Unknown Gatekeeper Network: ${network}`)
                }
              } else if (isActive) {
                await onMint()
                setClicked(false)
              }
            }}
          >
            {getMintButtonContent()}
          </MINT_BTN>
          {isWhitelist && getWhitelistSpots() && (
            <WHITELIST_SPOTS>{'You have ' + getWhitelistSpots() + ' spots left!'}</WHITELIST_SPOTS>
          )}
        </>
      ) : !wallet.wallet ? (
        <CONNECT_WRAPPER>
          <Connect />
        </CONNECT_WRAPPER>
      ) : (
        <>
          <MINT_BTN active={false}>JOIN WAITLIST</MINT_BTN>
        </>
      )}
      <SHARE_BTN onClick={() => setVisible(true)}>
        <img src="/img/assets/shareBlue.svg" />
      </SHARE_BTN>
    </MINT_BUTTON_BAR>
  )
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
