import React, { useState, FC } from 'react'
import styled from 'styled-components'
import { CheckOutlined } from '@ant-design/icons'

const ROADMAP_WRAPPER = styled.div`
  .elipse {
    height: 60px;
    width: 60px;
    margin-left: 0px;
  }
  .verticalLine {
    width: 30%;
    height: 5px;

    margin-left: 20px;
  }
  .verticalContainer {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .main-text {
    width: 50%;
    line-height: 20px;
    float: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .headingText {
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
  }
  .subHeadingText {
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: #b5b5b5;
    text-align: right;
    padding-top: 5px;
    margin: 0px;
  }
`
const STYLED_SHARE_PROFILE = styled.div`
  * {
    z-index: 1;
  }
  ${({ theme }) => `
    .ant-modal-body {
      padding: ${theme.margin(5)} ${theme.margin(7)};
    }
    .ant-modal-close {
      right: 35px;
      top: 35px;
      left: auto;
      img {
        filter: ${theme.filterCloseModalIcon};
      }
    }
    .share {
      font-family: Montserrat;
      font-size: 22px;
      font-weight: 600;
      color: ${theme.textShareModal};
      text-align: center;
    }
    .social-list {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      margin: 0 -${theme.margin(2)};
      margin-bottom: ${theme.margin(3)}
    }
    .social-item {
      padding: 0 ${theme.margin(2)};
      img {
        height: 60px;
        width: 60px;
        cursor: pointer;
      }
    }
    .social-text {
      text-transform: capitalize;
      font-family: Montserrat;
      font-size: 17px;
      font-weight: 500;
      text-align: center;
      margin-top: 20px;
      color: ${theme.textShareModal};
    }

    .social-icon{
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .social-icon--img {
      height: 60px;
      width: 60px;
      background: ${theme.success};
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      
      svg {
        display: block;
        height:24px !important;
        width:24px !important;
      }
    }
  `}
`

const TEAM_MEMBER_WRAPPER = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  .avatar {
    cursor: pointer;
    margin-bottom: 20px;

    margin-top: 15px;
  }
  .userNameText {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    margin-top: 15px;
    margin-bottom: 38px;
  }
`

const VESTING_WRAPPER = styled.div`
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 18%;
  }
  display: flex;
  flex-direction: column;
  .vestingStr {
    margin: auto;
    margin-left: 40px;
    margin-right: 40px;
    text-align: center;
    font-weight: 600;
    font-size: 22px;
    .percentText {
      font-weight: 600;
      font-size: 22px;
      color: #50bb35;
    }
  }
  .currencyImg {
    width: 35px;
    height: 35px;
    margin-right: 15px;
  }
  .raisedText {
    font-weight: 600;
    font-size: 25px;
  }
`

export const Vesting: FC<{ currency?: any; str?: string }> = ({ currency }) => (
  <>
    <VESTING_WRAPPER>
      <div className="wrapper">
        <img className="currencyImg" src={`/img/crypto/${currency}.svg`} alt="currency" />
        <div className="raisedText">{`${currency} raised:`}</div>
      </div>

      <div className="vestingStr">
        <span className="percentText">{`50% `}</span>
        unlocked upfront,
        <span className="percentText">{`25% `}</span>
        after 3 months,
        <span className="percentText">{`25% `}</span>
        after 6 months.
      </div>
    </VESTING_WRAPPER>
  </>
)

export const ShareInternal = ({ socials, handleShare }: any) => {
  const [selectedItem, setSelectedItem] = useState<string>()

  const handleClick = (item: string) => {
    setSelectedItem(item)
    handleShare(item)
    setTimeout(() => setSelectedItem(undefined), 3000)
  }

  return (
    <STYLED_SHARE_PROFILE>
      <p className="share">Share it with your friends!</p>
      <div className="social-list">
        {socials.map((item: string) => (
          <div className="social-item" key={item} onClick={() => handleClick(item)}>
            <div className="social-icon">
              {item === selectedItem ? (
                <CheckOutlined className={'social-icon--img'} />
              ) : (
                <img src={`/img/assets/${item.replace(' ', '-')}-circle.svg`} alt="" />
              )}
            </div>
          </div>
        ))}
      </div>
    </STYLED_SHARE_PROFILE>
  )
}

export const TeamMembers = ({ teamMembers }: { teamMembers: any[] }) => (
  <TEAM_MEMBER_WRAPPER>
    {teamMembers?.map((team, key) => (
      <div key={key}>
        {team?.dp_url ? (
          <div className="avatar">
            <img src={team?.dp_url} alt="" />
          </div>
        ) : (
          <div className="avatar">
            <img src={`/img/assets/avatar.svg`} alt="" />
          </div>
        )}
        <div className="userNameText">{team?.name}</div>
      </div>
    ))}
  </TEAM_MEMBER_WRAPPER>
)

export const RoadMap = ({ roadmap }: { roadmap: any[] }) => (
  <ROADMAP_WRAPPER>
    {roadmap?.map((road, key) => (
      <div className="verticalContainer" key={key}>
        <img className="elipse" src="/img/assets/elipse.svg" alt="" />
        <img className="verticalLine" src="/img/assets/vectorLine.svg" alt="" />
        <div className="main-text">
          <div className="headingText">{road?.heading}</div>
          <div className="subHeadingText">{road?.subheading + ' ' + road?.subheading}</div>
        </div>
      </div>
    ))}
  </ROADMAP_WRAPPER>
)
