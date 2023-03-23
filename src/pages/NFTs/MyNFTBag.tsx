/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, Dropdown, Menu } from 'antd'
import React, { ReactElement, FC, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Connect } from '../../layouts'
import { useConnectionConfig } from '../../context'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const BAG_WRAPPER = styled.div`
  .zeroItemBag {
    ${tw`w-[26px] h-[30px] cursor-pointer -mr-2`}
  }
  * {
    animation-duration: 0s !important;
  }
  .itemsPresentBag {
    ${tw`w-[26px] h-[30px] cursor-pointer -mr-2`}
  }
  .noOfItemsInBag {
    ${tw`absolute text-[15px] mt-1.5 ml-2 font-semibold cursor-pointer`}
  }
`
const MY_BAG = styled(Menu)`
  border: 1px solid;
  ${tw`w-[245px] h-[394px] rounded-[10px] sm:w-[100vw] sm:h-[auto] sm:fixed sm:left-0 sm:border-none sm:bottom-0 `}
  background-color: ${({ theme }) => theme.bg20};
  .bagContainer {
    ${tw`flex flex-col pt-3 px-[10px]`}
  }
  .nothingHere {
    ${tw`text-center text-[15px] font-semibold mt-8 sm:gap-5 sm:mt-0`}
    color: ${({ theme }) => theme.text33};
  }
  .headerContainer {
    ${tw`flex items-center gap-4 sm:justify-between`}
  }
  .bagContentContainer {
    ${tw`h-[230px] sm:h-auto mb-20`}
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
    ${tw`text-[15px] font-semibold sm:mr-4`}
    color: ${({ theme }) => theme.text34}
  }
`

const MyNFTBag = (): ReactElement => {
  const { publicKey } = useWallet()
  const itemsPresentInBag = true // no items in the bag
  return (
    <BAG_WRAPPER>
      <Dropdown
        align={{ offset: [0, 16] }}
        destroyPopupOnHide={true}
        overlay={<MyBagContent />}
        trigger={['click']}
      >
        {publicKey && itemsPresentInBag ? (
          <div>
            <div className="noOfItemsInBag">2</div>
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
  const itemsPresentInBag = true // no items in the bag

  return (
    <MY_BAG>
      <div className="bagContainer">
        <div className="headerContainer">
          <div className="myBagText">My Bag (0)</div>
          <div className="clearText">Clear</div>
        </div>
        {itemsPresentInBag ? <ItemsPresentInBag /> : <EmptyBagDisplay />}
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
const ItemsPresentInBag = (): ReactElement => {
  console.log('no items')
  return <div className="bagContentContainer">items</div>
}
const EmptyBagDisplay = (): ReactElement => (
  <div
    style={{}}
    tw="flex 
items-center sm:h-auto flex-col sm:flex-row sm:mb-[100px] h-[230px] justify-center"
  >
    <div>
      <img src="/img/assets/Aggregator/bagAnimationDark.svg" tw="h-[65px] w-[73px] mt-2 mr-5" />
    </div>
    <div className="nothingHere">
      Whoops.. <br />
      Nothing in here!
    </div>
  </div>
)

const ButtonContainerForBag = (): ReactElement => {
  const { publicKey } = useWallet()
  const disabled = false
  const enoughFunds = true
  const itemsInBag = false
  const { connection } = useConnectionConfig()
  const [userSOLBalance, setUserSOLBalance] = useState<number>(0)
  useEffect(() => {
    const SOL = connection.getAccountInfo(publicKey)
    SOL.then((res) => setUserSOLBalance(parseFloat((res.lamports / LAMPORTS_PER_SOL).toFixed(3)))).catch((err) =>
      console.log(err)
    )
  }, [publicKey])

  return (
    <div className="buttonContainer">
      {publicKey ? (
        <>
          {itemsInBag && <BagTokenBalanceRow title="You pay:" amount={250} />}
          <BagTokenBalanceRow title="Your Balance:" amount={userSOLBalance} />
          <Button className="button" disabled={disabled}>
            {enoughFunds ? 'Buy now' : 'Insufficient SOL'}
          </Button>
        </>
      ) : (
        <>
          <BagTokenBalanceRow title="Your Balance:" amount={0} />
          <div className="connectWallet">
            <Connect />
          </div>
        </>
      )}
    </div>
  )
}
export default MyNFTBag
