/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { Button, Dropdown, Menu } from 'antd'
import React, { ReactElement, FC, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Connect } from '../../layouts'
import { useConnectionConfig, useDarkMode, useNFTAggregator } from '../../context'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { GradientText } from '../../components/GradientText'
import { PriceWithToken } from '../../components/common/PriceWithToken'
import { minimizeTheString } from '../../web3/nfts/utils'
import { LAMPORTS_PER_SOL_NUMBER } from '../../constants'
import Lottie from 'lottie-react'
import EmptyBagDark from '../../animations/emptyBag-dark.json'
import EmptyBagLite from '../../animations/EmptyBag-lite.json'
import { WalletAccountError } from '@solana/wallet-adapter-base'

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
const MY_BAG = styled(Menu)`
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
    ${tw`flex items-center gap-4 sm:justify-between`}
  }
  .bagContentContainer {
    ${tw`h-[233px] flex flex-col sm:h-auto mb-20`}
    ${({ theme }) => theme.customScrollBar('2px')}

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

  return (
    <BAG_WRAPPER>
      <Dropdown
        align={{ offset: [0, 16] }}
        destroyPopupOnHide={true}
        overlay={<MyBagContent />}
        trigger={['click']}
      >
        {itemsPresentInBag ? (
          <div className="zeroItemBag">
            <div className="noOfItemsInBag">{nftInBag.length}</div>
            <img className="itemsPresentBag" src="/img/assets/Aggregator/itemsInBag.svg" alt="bag" />
          </div>
        ) : (
          <img className="zeroItemBag" src="/img/assets/Aggregator/zeroItemsInBag.svg" alt="bag" />
        )}
      </Dropdown>
    </BAG_WRAPPER>
  )
}
const MyBagContent = (): ReactElement => {
  const { nftInBag, setNftInBag } = useNFTAggregator()
  const itemsPresentInBag = nftInBag.length // no items in the bag
  const { wallet } = useWallet()
  return (
    <MY_BAG>
      <div className="bagContainer">
        <div className="headerContainer">
          <div className="myBagText">My Bag ({nftInBag.length})</div>
          <div className={nftInBag.length ? 'clearTextActive' : 'clearText'} onClick={() => setNftInBag([])}>
            Clear
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
      {amount}
      <img src={'/img/crypto/SOL.svg'} alt="" />
    </div>
  </div>
)
const ItemsPresentInBag: FC<{ wallet: any }> = ({ wallet }): ReactElement => {
  const { nftInBag, setNftInBag } = useNFTAggregator()
  const removeNft = (clickedNft) => {
    const removedBag = nftInBag.filter((nft) => nft.uuid !== clickedNft.uuid)
    setNftInBag(removedBag)
  }
  console.log(wallet)

  return (
    <div className="bagContentContainer" style={{ height: wallet ? '233px' : '280px' }}>
      {nftInBag.map((nft, index) => (
        <div tw="flex items-center mt-[15px]" key={index}>
          <img className="nftImage" src={nft.image_url} alt="img" />
          <img
            className="closeImg"
            onClick={() => removeNft(nft)}
            src={`/img/assets/Aggregator/closeRed.svg`}
            alt="img"
          />
          <div tw="flex flex-col text-[15px] font-semibold">
            <div className="nftNumber">#{nft?.nft_name?.split('#')[1]}</div>
            <div>
              <GradientText
                text={minimizeTheString(nft?.nft_name?.split('#')[0], 8)}
                fontSize={16}
                fontWeight={600}
              />
            </div>
          </div>
          <div tw="ml-auto">
            <PriceWithToken
              price={parseFloat(nft?.buyer_price) / LAMPORTS_PER_SOL_NUMBER}
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
  const { publicKey } = useWallet()
  const { nftInBag } = useNFTAggregator()
  const disabled = false
  const itemsInBag = nftInBag.length
  const { connection } = useConnectionConfig()
  const [userSOLBalance, setUserSOLBalance] = useState<number>(0)

  useEffect(() => {
    const SOL = connection.getAccountInfo(publicKey)
    SOL.then((res) => setUserSOLBalance(parseFloat((res.lamports / LAMPORTS_PER_SOL).toFixed(3)))).catch((err) =>
      console.log(err)
    )
  }, [publicKey])

  const totalCost = useMemo(() => {
    let sum = 0
    for (const nft of nftInBag) sum += parseFloat(nft.buyer_price) / LAMPORTS_PER_SOL_NUMBER
    return sum
  }, [nftInBag])
  const enoughFunds = totalCost < userSOLBalance

  return (
    <div className="buttonContainer">
      {publicKey ? (
        <>
          {itemsInBag ? <BagTokenBalanceRow title="You pay:" amount={totalCost} /> : <></>}
          <BagTokenBalanceRow title="Your Balance:" amount={userSOLBalance} />
          <Button className="button" disabled={!enoughFunds}>
            {enoughFunds ? 'Buy now' : 'Insufficient SOL'}
          </Button>
        </>
      ) : (
        <>
          <BagTokenBalanceRow title="Your Balance:" amount={0} />
          <div className="connectWallet">
            <Connect customButtonStyle={[tw`w-[225px]`]} />
          </div>
        </>
      )}
    </div>
  )
}
export default MyNFTBag
