import React, { ReactNode } from 'react'
import { notification } from 'antd'
import styled from 'styled-components'
import { shortenAddress } from './misc'

const CLOSE = styled.div`
  background-color: red;
`

const CONTENT_ICON = styled.div`
  display: flex;
  justify-content: center;
  align-items: center
  height: 16px;
  width: 16px;

  > img {
    height: inherit;
    width: inherit;
    object-fit: contain;
  }
`

const MESSAGE = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 12px;
    font-weight: 600;
  }
`

const DESCRIPTION = styled(MESSAGE)`
  margin-top: 16px;
`

const TX_LINK = styled.a`
  color: white;

  &:hover {
    color: white;
    text-decoration-line: underline;
  }
`

interface INotifyParams {
  message: string
  description?: string | ReactNode
  icon?: string
  txid?: string
  type?: string
}

export const notify = ({ description, icon, message, txid, type = 'info' }: INotifyParams, e?: any) => {
  if (e) {
    description = e.message
  }

  if (txid) {
    description = (
      <>
        <span>Transaction ID:</span>
        <TX_LINK href={'https://solscan.io/tx/' + txid} target="_blank" rel="noopener noreferrer">
          {shortenAddress(txid, 8)}
        </TX_LINK>
      </>
    )
  }

  const key = String(Math.random())

  ;(notification as any)[type]({
    closeIcon: <CLOSE />,
    description: description && (
      <DESCRIPTION>{typeof description === 'string' ? <span>{description}</span> : description}</DESCRIPTION>
    ),
    icon: <div style={{ display: 'none' }} />,
    key,
    message: (
      <MESSAGE>
        <span>{message}</span>
        {icon && (
          <CONTENT_ICON>
            <img src={`${process.env.PUBLIC_URL}/img/assets/notify_${icon}.svg`} alt="icon" />
          </CONTENT_ICON>
        )}
      </MESSAGE>
    ),
    onClick: () => notification.close(key),
    placement: 'bottomLeft',
    style: {
      backgroundColor: type === 'error' ? '#bb3535' : '#3735bb',
      borderRadius: '20px',
      padding: '32px 16px',
      minWidth: '320px'
    }
  })
}
