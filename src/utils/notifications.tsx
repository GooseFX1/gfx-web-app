import React, { ReactNode } from 'react'
import { notification } from 'antd'
import styled from 'styled-components'

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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;

  > span {
    width: 100%;
  }
`

const TX_LINK = styled.a`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 16px;
  color: white;

  &:hover > span {
    text-decoration-line: underline;
    color: white;
  }
`

interface INotifyParams {
  message: string | ReactNode
  description?: string | ReactNode
  icon?: string
  txid?: string
  type?: string
}

export const notify = async ({ description, icon, message, txid, type = 'info' }: INotifyParams, e?: any) => {
  if (e) {
    description = e.message
    if (description !== null && description !== undefined) {
      let re = /custom program error: (0x\d+)/
      let match = description.toString().match(re)
      if (match) {
        description = (await import('gfx_stocks_pool')).format_error_code(parseInt(match[0]))
      }
    }
  }

  if (txid) {
    description = (
      <>
        <span>{description}</span>
        <TX_LINK href={'https://solscan.io/tx/' + txid} target="_blank" rel="noopener noreferrer">
          <span>View on Solscan</span>
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
    message:
      typeof message === 'string' ? (
        <MESSAGE>
          <span>{message}</span>
          {icon && (
            <CONTENT_ICON>
              <img src={`${process.env.PUBLIC_URL}/img/assets/notify_${icon}.svg`} alt="icon" />
            </CONTENT_ICON>
          )}
        </MESSAGE>
      ) : (
        message
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
