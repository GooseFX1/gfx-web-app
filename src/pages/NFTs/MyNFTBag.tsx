/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { Dropdown, Menu } from 'antd'
import React, {
  ReactElement,
  FC,
  useMemo,
  useState,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch
} from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Connect } from '../../layouts'
import { useConnectionConfig, useDarkMode, useNFTAggregator } from '../../context'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { GradientText } from '../../components/GradientText'
import { PriceWithToken } from '../../components/common/PriceWithToken'
import { minimizeTheString, removeNFTFromBag } from '../../web3/nfts/utils'
import { LAMPORTS_PER_SOL_NUMBER } from '../../constants'
import Lottie from 'lottie-react'
import EmptyBagDark from '../../animations/emptyBag-dark.json'
import EmptyBagLite from '../../animations/EmptyBag-lite.json'
import { formatSOLDisplay, notify } from '../../utils'
import { Button } from '../../components'
import { NFT_MARKETS } from '../../api/NFTs/constants'
import { logData } from '../../api/analytics'
import { INFTGeneralData, ITensorBuyIX } from '../../types/nft_details'
import {
  confirmTransaction,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  toPublicKey
} from '../../web3'
import { getMagicEdenBuyInstruction, getMagicEdenListing, getTensorBuyInstruction } from '../../api/NFTs'
import { pleaseTryAgain, successfulNFTPurchaseMsg } from './Collection/AggModals/AggNotifications'

const BAG_WRAPPER = styled.div`
  .zeroItemBag {
    ${tw`w-[26px] h-[30px] cursor-pointer -mr-2 fixed top-6 right-24 `}
    z-index: 1000;
  }
  .nftNumber {
    color: ${({ theme }) => theme.text11} !important;
  }
  * {
    animation-duration: 0s !important;
  }
  .itemsPresentBag {
    ${tw`w-[26px] h-[30px] cursor-pointer -mr-2`}
  }
  .noOfItemsInBag {
    ${tw`absolute text-[15px] mt-1.5 ml-2 text-[#fff] font-semibold cursor-pointer`}
  }
`
const MY_BAG = styled.div`
  border: 1px solid;
  ${tw`w-[245px] h-[394px] rounded-[10px] sm:w-[100vw] sm:h-[auto] sm:fixed sm:left-0 sm:border-none sm:bottom-0 `}
  background-color: ${({ theme }) => theme.bg20};
  .bagContainer {
    ${tw`flex flex-col pt-1 px-[10px]`}
  }
  .emptyBag {
    transform: scale(3.2);
  }
  .nothingHere {
    ${tw`text-center text-[15px] mt-[-20px] font-semibold sm:gap-5 sm:mt-0`}
    color: ${({ theme }) => theme.text33};
  }
  .headerContainer {
    ${tw`flex items-center gap-4 sm:justify-between z-[9999]`}
  }
  .bagContentContainer {
    ${tw`h-[233px] flex flex-col sm:h-auto mb-20`}
    ${({ theme }) => theme.customScrollBar('1px')}

    .nftNumber {
      color: ${({ theme }) => theme.text4} !important;
    }
    .nftImage {
      ${tw`h-[60px] w-[60px] left-0 rounded-[5px] `}
    }
    .closeImg {
      ${tw`relative h-5 w-5  mt-[-50px] ml-[-10px] cursor-pointer `}
    }
    overflow-y: auto;
  }
  .myBagText {
    ${tw`font-semibold text-[18px] `}
    color: ${({ theme }) => theme.text33};
  }
  .buttonContainer {
    border-top: 1px solid ${({ theme }) => theme.tokenBorder};
    ${tw` flex flex-col bottom-2 absolute items-center justify-between w-[92%] `}
    .tokenBalanceText {
      color: #636363;
    }
    .tokenBalance {
      ${tw`flex font-semibold text-[15px] items-center`}
      color: ${({ theme }) => theme.text11};
      img {
        ${tw`h-[20px] w-[20px] ml-1`}
      }
    }
    .button {
      ${tw`h-[40px] w-[225px] flex items-center mb-1 border-none text-[15px] text-center 
       font-semibold mx-2.5 mt-1.5 rounded-[30px] bg-[#5855ff] flex items-center justify-center `}
      :disabled {
        background: ${({ theme }) => theme.bg22};
      }
      :hover {
        color: white;
      }
    }
  }
  .clearText {
    ${tw`text-[15px] font-semibold sm:mr-4 cursor-pointer`}
    color: ${({ theme }) => theme.text34}
  }
  .clearTextActive {
    ${tw`text-[15px] font-semibold sm:mr-4 cursor-pointer`}
    color: ${({ theme }) => theme.textWhitePurple}
  }
`

export const MyNFTBag = (): ReactElement => {
  const { nftInBag } = useNFTAggregator()
  const itemsPresentInBag = nftInBag.length // no items in the bag

  useEffect(() => {
    if (Object.keys(nftInBag).length && !visible) setVisible(true)
  }, [nftInBag])

  const handleDropdownClick = async () => {
    await setVisible((prev) => !prev)
  }

  return (
    <BAG_WRAPPER>
      <Dropdown
        align={{ offset: [0, 16] }}
        destroyPopupOnHide={true}
        overlay={<MyBagContent handleDropdownClick={handleDropdownClick} />}
        trigger={['click']}
        open={visible}
      >
        <div onClick={handleDropdownClick}>
          {itemsPresentInBag ? (
            <div className="zeroItemBag">
              <div className="noOfItemsInBag">{itemsPresentInBag}</div>
              <img className="itemsPresentBag" src="/img/assets/Aggregator/itemsInBag.svg" alt="bag" />
            </div>
          ) : (
            <img className="zeroItemBag" src="/img/assets/Aggregator/zeroItemsInBag.svg" alt="bag" />
          )}
        </div>
      </Dropdown>
    </BAG_WRAPPER>
  )
}
const MyBagContent: FC<{ handleDropdownClick: () => void }> = ({ handleDropdownClick }): ReactElement => {
  const { nftInBag, setNftInBag } = useNFTAggregator()
  const itemsPresentInBag = Object.keys(nftInBag ? nftInBag : {}).length // no items in the bag
  const { wallet } = useWallet()
  const { mode } = useDarkMode()
  return (
    <MY_BAG>
      <div className="bagContainer">
        <div className="headerContainer">
          <div className="myBagText">My Bag ({itemsPresentInBag})</div>
          <div className={itemsPresentInBag ? 'clearTextActive' : 'clearText'} onClick={() => setNftInBag({})}>
            Clear
          </div>
          <div tw="ml-auto" onClick={handleDropdownClick}>
            <img
              tw="h-4 w-4  z-[100] cursor-pointer"
              src={mode === 'dark' ? `/img/assets/close-white-icon.svg` : `/img/assets/close-gray-icon.svg`}
            />
          </div>
        </div>

        {itemsPresentInBag ? <ItemsPresentInBag wallet={wallet} /> : <EmptyBagDisplay />}
        <ButtonContainerForBag />
      </div>
    </MY_BAG>
  )
}

const BagTokenBalanceRow: FC<{ title: string; amount: number }> = ({ title, amount }): ReactElement => (
  <div tw={'flex items-center justify-between w-full mt-1 mb-1'}>
    <div className="tokenBalanceText" tw={'font-semibold'}>
      {title}
    </div>
    <div className="tokenBalance">
      {formatSOLDisplay(amount)}
      <img src={'/img/crypto/SOL.svg'} alt="" />
    </div>
  </div>
)

const ItemsPresentInBag: FC<{ wallet: any }> = ({ wallet }): ReactElement => {
  const { nftInBag, setNftInBag } = useNFTAggregator()

  return (
    <div className="bagContentContainer" style={{ height: wallet ? '238px' : '284px' }}>
      {Object.entries(nftInBag).map(([key, nft], index: number) => (
        <div tw="flex items-center mt-[15px]" key={key}>
          <img className="nftImage" src={nftInBag[key]?.image_url} alt="img" />
          <img
            className="closeImg"
            onClick={() => removeNFTFromBag(nft.mint_address, setNftInBag)}
            src={`/img/assets/Aggregator/closeRed.svg`}
            alt="img"
          />
          <div tw="flex flex-col text-[15px] font-semibold">
            <div className="nftNumber">#{nftInBag[key]?.nft_name?.split('#')[1]}</div>
            <div>
              <GradientText
                text={minimizeTheString(nftInBag[key]?.nft_name?.split('#')[0], 8)}
                fontSize={16}
                fontWeight={600}
              />
            </div>
          </div>
          <div tw="ml-auto">
            <PriceWithToken
              price={parseFloat(nftInBag[key]?.buyer_price) / LAMPORTS_PER_SOL_NUMBER}
              token={'SOL'}
              cssStyle={tw`h-5 w-5`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
const EmptyBagDisplay = (): ReactElement => {
  const { mode } = useDarkMode()
  return (
    <div tw="flex items-center sm:h-auto flex-col sm:flex-row sm:mb-[100px] h-[230px] justify-center">
      <div>
        {mode === 'dark' ? (
          <Lottie className="emptyBag" animationData={EmptyBagDark} />
        ) : (
          <Lottie className="emptyBag" animationData={EmptyBagLite} />
        )}
      </div>
      <div className="nothingHere">
        Whoops.. <br />
        Nothing in here!
      </div>
    </div>
  )
}

const ButtonContainerForBag = (): ReactElement => {
  const { wallet, sendTransaction } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const { nftInBag, setOperatingNFT } = useNFTAggregator()
  const disabled = false
  const itemsInBag = Object.keys(nftInBag ? nftInBag : {}).length
  const { connection } = useConnectionConfig()
  const [userSOLBalance, setUserSOLBalance] = useState<number>(0)

  useEffect(() => {
    const SOL = connection.getAccountInfo(publicKey)
    SOL.then((res) => setUserSOLBalance(parseFloat((res.lamports / LAMPORTS_PER_SOL).toFixed(3)))).catch((err) =>
      console.error(err)
    )
  }, [publicKey])

  const totalCost = useMemo(() => {
    let sum = 0
    for (const key in nftInBag) {
      sum += parseFloat(nftInBag[key].buyer_price) / LAMPORTS_PER_SOL_NUMBER
    }
    return sum
  }, [nftInBag])
  const enoughFunds = totalCost < userSOLBalance
  const callMagicEdenAPIs = async (item): Promise<VersionedTransaction | Transaction> => {
    const tokenAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        toPublicKey(item.wallet_key).toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        toPublicKey(item.mint_address).toBuffer()
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
    try {
      const listing_res = await getMagicEdenListing(item?.mint_address, process.env.REACT_APP_JWT_SECRET_KEY)
      const res = await getMagicEdenBuyInstruction(
        parseFloat(item.buyer_price) / LAMPORTS_PER_SOL_NUMBER,
        publicKey.toBase58(),
        item.wallet_key,
        item.token_account_mint_key,
        listing_res.data?.[0].tokenAddress ? listing_res.data?.[0].tokenAddress : tokenAccount[0].toString(),
        process.env.REACT_APP_JWT_SECRET_KEY,
        listing_res.data?.[0].expiry ? listing_res?.data[0].expiry.toString() : '-1'
      )

      const tx = VersionedTransaction.deserialize(Buffer.from(res.data.v0.txSigned.data))
      return tx
    } catch (err) {
      console.log(err)
    }
  }
  const callTensorAPIs = async (item): Promise<VersionedTransaction | Transaction> => {
    try {
      const res: ITensorBuyIX = await getTensorBuyInstruction(
        parseFloat(item.buyer_price),
        publicKey.toBase58(),
        item.wallet_key,
        item.token_account_mint_key,
        process.env.REACT_APP_JWT_SECRET_KEY
      )

      const tx = res.data.legacy_tx
        ? Transaction.from(Buffer.from(res.data.bytes))
        : VersionedTransaction.deserialize(Buffer.from(res.data.bytes))
      return tx
    } catch (err) {
      console.log(err)
      // setIsLoading(false)
      // notify()
    }
  }

  const handleBuyFlow = async (e: any) => {
    e.preventDefault()
    // logData(`attempt_buy_now_${ask?.marketplace_name?.toLowerCase()}`)
  }
  const handleNotifications = async (tx: Transaction | VersionedTransaction, item: any) => {
    try {
      // setting this as operating nft , for loading buttons
      const signature = await sendTransaction(tx, connection)
      console.log(signature)
      const confirm = await confirmTransaction(connection, signature, 'finalized')
      if (confirm.value.err === null) {
        notify(successfulNFTPurchaseMsg(signature, item.nft_name, formatSOLDisplay(item.buyer_price)))
      }
    } catch (error) {
      // deleting this from list of operating nft, for loading buttons
      setOperatingNFT((prevSet) => {
        const newSet = new Set(prevSet)
        newSet.delete(item?.mint_address)
        return newSet
      })
      pleaseTryAgain(true, error?.message)
    }
  }
  const handleBulkPurchase = async () => {
    const readyTx = {}
    for (const key in nftInBag) {
      setOperatingNFT((prevSet) => new Set([...Array.from(prevSet), nftInBag[key]?.mint_address]))
      if (nftInBag[key].marketplace_name === NFT_MARKETS.TENSOR) {
        readyTx[key] = await callTensorAPIs(nftInBag[key])
      }
      if (nftInBag[key].marketplace_name === NFT_MARKETS.MAGIC_EDEN) {
        readyTx[key] = await callMagicEdenAPIs(nftInBag[key])
      }
    }
    for (const key in readyTx) {
      handleNotifications(readyTx[key], nftInBag[key])
    }
  }

  return (
    <div className="buttonContainer">
      {publicKey ? (
        <>
          {itemsInBag ? <BagTokenBalanceRow title="You pay:" amount={totalCost} /> : <></>}
          <BagTokenBalanceRow title="Your Balance:" amount={userSOLBalance} />
          <Button className="button" disabled={!enoughFunds} onClick={handleBulkPurchase}>
            {enoughFunds ? 'Buy now' : 'Insufficient SOL'}
          </Button>
        </>
      ) : (
        <>
          <BagTokenBalanceRow title="Your Balance:" amount={0} />
          <div className="connectWallet">
            <Connect customButtonStyle={[tw`w-[225px] min-md:w-[225px]`]} />
          </div>
        </>
      )}
    </div>
  )
}
export default MyNFTBag
