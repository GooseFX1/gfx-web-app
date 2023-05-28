import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { useDarkMode } from '../../../context'
import styled from 'styled-components'
import tw, { TwStyle } from 'twin.macro'
import 'styled-components/macro'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../../layouts'

const NO_CONTENT = styled.div<{ $cssStyle?: TwStyle }>`
  ${tw`flex items-center justify-center h-[calc(100vh - 260px)] mt-[-80px]  sm:h-[calc(100vh - 100px)]
  dark:bg-black-1 bg-grey-6 h-[calc(90vh - 32px)]`}
  /* tw="h-[calc(90vh - 32px)] sm:h-[calc(90vh- 50px)]  w-[77vw] sm:w-[100vw] sm:mt-16 mt-[32px]" */

  ${({ $cssStyle }) => $cssStyle};
  text-align: center;
  padding: 10px 0;

  .no-data-image {
    ${tw`max-w-[143px] max-h-[123px] sm:max-h-[80px] sm:max-w-[80px]`}
    margin-bottom: 20px;
  }
  .main-text {
    ${tw`text-[20px] sm:text-[18px] font-semibold mb-1.5 text-black-4 dark:text-grey-5`}
  }
  .sub-text {
    ${tw`text-[15px] sm:text-[13px] font-medium text-grey-1 dark:text-grey-2`}
  }
  .btn {
    min-width: 132px;
    height: 41px;
    background: #9625ae;
    margin-top: 30px;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    border: none;
    border-radius: 41px;
    cursor: pointer;
    transition: all 0.1s;
    &:hover {
      opacity: 0.8;
    }
  }
`

interface Props {
  type: string
  setDisplayIndex?: Dispatch<SetStateAction<number>>
  cssStyle?: TwStyle
}

const options = {
  collected: {
    mainText: 'No Collection',
    subText: 'Start adding NFTs to your collection',
    textButton: 'Explore NFT’s',
    bgButton: '#5855ff'
  },
  noItems: {
    mainText: 'No Items',
    subText: 'Start buying or bidding for items in this collection \n to see your items here.',
    textButton: 'See Listed Items',
    bgButton: '#5855ff'
  },
  favorited: {
    mainText: 'No Items Liked',
    subText: 'Explore and like your most favorite ones. Coming soon',
    textButton: 'Explore NFT’s',
    bgButton: '#5855ff'
  },
  activity: {
    mainText: 'No Recent Activity',
    subText: 'Buy, Create or Sell and NFT to see activity.',
    textButton: ''
  }
}

const NoContent = ({ type, setDisplayIndex, cssStyle }: Props) => {
  const history = useHistory()
  const obj = options[type]
  const { mode } = useDarkMode()
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey, wallet?.adapter])

  const handleNoContentClick = () => {
    switch (type) {
      case 'collected':
        history.push('/nfts')
        break
      case 'created':
        history.push('/NFTs/create')
        break
      case 'favorited':
        history.push('/nfts')
        break
      case 'noItems':
        setDisplayIndex(0)
        break
      default:
        console.error('Profile button issue')
    }
  }

  return (
    <NO_CONTENT $cssStyle={cssStyle}>
      <div className="spacing">
        <img
          className="no-data-image"
          src={`/img/assets/${type}-no-data-${mode === 'dark' ? 'dark' : 'lite'}.png`}
          alt={`no-${type}-found`}
        />
        <div className="main-text">{obj.mainText}</div>
        <div className="sub-text">{obj.subText}</div>
        {!publicKey && type === 'noItems' ? (
          <div tw="ml-[200px] mt-8">
            <Connect width="150px" />
          </div>
        ) : (
          obj.textButton && (
            <button className="btn" style={{ background: obj.bgButton }} onClick={handleNoContentClick}>
              {obj.textButton}
            </button>
          )
        )}
      </div>
    </NO_CONTENT>
  )
}

export default React.memo(NoContent)
