import React, { useState } from 'react'
import styled from 'styled-components'
import { PopupCustom } from './Popup/PopupCustom'
import { CheckOutlined } from '@ant-design/icons'

const STYLED_SHARE_PROFILE = styled(PopupCustom)`
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
    .title {
      font-family: Montserrat;
      font-size: 25px;
      font-weight: 600;
      color: ${theme.textShareModal};
      margin-bottom: ${theme.margin(4)};
    }
    .social-list {
      display: flex;
      align-item: center;
      margin: 0 -${theme.margin(2)};
    }
    .social-item {
      padding: 0 ${theme.margin(2)};
      img {
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
    .social-icon--img {
      height: 90px;
      width: 90px;
      background: ${theme.success};
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      
      svg {
        display: block;
        height:32px !important;
        width:32px !important;
      }
    }
  `}
`

interface IShare {
  visible: boolean
  handleCancel: Function
  socials: string[]
  handleShare: (social: string) => void
}

export const Share = ({ visible, handleCancel, socials, handleShare }: IShare) => {
  const [selectedItem, setSelectedItem] = useState<string>()

  const handleClick = (item: string) => {
    setSelectedItem(item)
    handleShare(item)
    setTimeout(() => setSelectedItem(undefined), 3000)
  }

  return (
    <STYLED_SHARE_PROFILE
      width="587px"
      height="310px"
      title={null}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <h1 className="title">Share</h1>
      <div className="social-list">
        {socials.map((item) => (
          <div className="social-item" key={item} onClick={(e) => handleClick(item)}>
            <div className="social-icon">
              {item === selectedItem ? (
                <CheckOutlined className={'social-icon--img'} />
              ) : (
                <img src={`/img/assets/${item.replace(' ', '-')}-circle.svg`} alt="" />
              )}
            </div>
            <div className="social-text">{item}</div>
          </div>
        ))}
      </div>
    </STYLED_SHARE_PROFILE>
  )
}
