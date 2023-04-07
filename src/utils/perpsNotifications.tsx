/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactNode } from 'react'
import { notification } from 'antd'
import styled from 'styled-components'

const CLOSE = styled.div`
  background-color: red;
`

const CONTENT_ICON = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: white !important;

  &:hover > span {
    text-decoration-line: underline;
    color: white !important;
  }
`

type IStyles = {
  [x: string]: string
}

interface INotifyParams {
  message: string | ReactNode
  description?: string | ReactNode
  icon?: string
  txid?: string
  type?: string
  styles?: IStyles
  network?: string
  notificationDuration?: number
}
const NOTIFICATION_TIMER = 5 * 1000

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const perpsNotify = async ({ action, message, description, styles, key }) => {
  const openNotification = () => {
    notification.open({
      closeIcon: <CLOSE />,
      description: description,
      icon: <div style={{ display: 'none' }} />,
      key,
      duration: 10,
      message:
        typeof message === 'string' ? (
          <MESSAGE>
            <span>{message}</span>
          </MESSAGE>
        ) : (
          message
        ),
      onClick: () => notification.close(key),
      placement: 'bottomLeft',
      style: {
        backgroundColor: '#3735bb',
        borderRadius: '20px',
        padding: '32px 16px',
        minWidth: '320px',
        ...styles
      }
    })
  }
  try {
    if (action === 'close') {
      openNotification()
      setTimeout(function () {
        notification.close(key)
      }, NOTIFICATION_TIMER)
    } else if (action === 'open') {
      openNotification()
    }
  } catch (e) {
    console.log('could not close')
  }
  //  setTimeout(() => {
  //    notification.close(key)
  //  }, NOTIFICATION_TIMER)
  //  ;(notification as any)['info']()
}
