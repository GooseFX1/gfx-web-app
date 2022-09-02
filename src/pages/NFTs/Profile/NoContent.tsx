import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

const NO_CONTENT = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 66px);
  text-align: center;
  padding: 16px 0;

  .no-data-image {
    max-width: 160px;
    margin-bottom: 20px;
  }
  .main-text {
    font-size: 17px;
    font-weight: 600;
    color: ${({ theme }) => theme.text8};
    margin-bottom: 5px;
  }
  .sub-text {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.text8};
  }
  .btn {
    min-width: 132px;
    height: 41px;
    background: #9625ae;
    margin-top: 30px;
    font-size: 12px;
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
}

const options = {
  collected: {
    mainText: 'No NFT’s Collected',
    subText: 'Let’s start your collection, go and buy your 1st NFT',
    textButton: 'Explore NFT’s',
    bgButton: '#9625ae'
  },
  created: {
    mainText: 'No NFT’s Created',
    subText: 'Start your journey as a creator today.',
    textButton: 'Create NFT',
    bgButton: '#3735bb'
  },
  favorited: {
    mainText: 'No NFT’s Liked',
    subText: 'Explore and like your most favorite ones.',
    textButton: 'Explore NFT’s',
    bgButton: '#9625ae'
  },
  activity: {
    mainText: 'No Recent Activity',
    subText: 'Buy, Create or Sell and NFT to see activity.',
    textButton: ''
  }
}

const NoContent = ({ type }: Props) => {
  const history = useHistory()
  const obj = options[type]

  const handleNoContentClick = () => {
    switch (type) {
      case 'collected':
        history.push('/NFTs')
        break
      case 'created':
        history.push('/NFTs/create')
        break
      case 'favorited':
        history.push('/NFTs')
        break
      default:
        console.error('Profile button issue')
    }
  }

  return (
    <NO_CONTENT>
      <div>
        <img className="no-data-image" src={`/img/assets/${type}-no-data.png`} alt="" />
        <div className="main-text">{obj.mainText}</div>
        <div className="sub-text">{obj.subText}</div>
        {obj.textButton && (
          <button className="btn" style={{ background: obj.bgButton }} onClick={handleNoContentClick}>
            {obj.textButton}
          </button>
        )}
      </div>
    </NO_CONTENT>
  )
}

export default React.memo(NoContent)
