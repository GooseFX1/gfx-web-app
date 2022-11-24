import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useDarkMode } from '../../../context'

const NO_CONTENT = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 66px);
  text-align: center;
  padding: 16px 0;

  .spacing {
    margin-top: 250px;
  }

  .no-data-image {
    max-width: 160px;
    margin-bottom: 20px;
  }
  .main-text {
    font-size: 17px;
    font-weight: 600;
    color: ${({ theme }) => theme.text32};
    margin-bottom: 5px;
  }
  .sub-text {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.text30};
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
}

const options = {
  collected: {
    mainText: 'No Collection',
    subText: 'Start adding NFTs to your collection',
    textButton: 'Explore NFT’s',
    bgButton: '#5855ff'
  },
  // created: {
  //   mainText: 'No NFT’s Created',
  //   subText: 'Start your journey as a creator today.',
  //   textButton: 'Create NFT',
  //   bgButton: '#3735bb'
  // },
  favorited: {
    mainText: 'No Favorites',
    subText: 'Explore and like your most favorite ones.',
    textButton: 'Explore NFT’s',
    bgButton: '#5855ff'
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
  const { mode } = useDarkMode()

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
      <div className="spacing">
        <img
          className="no-data-image"
          src={`/img/assets/${type}-no-data-${mode === 'dark' ? 'dark' : 'lite'}.png`}
          alt={`no-${type}-found`}
        />
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
