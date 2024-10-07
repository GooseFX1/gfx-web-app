/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactNode } from 'react'
import { notification } from 'antd'
import styled from 'styled-components'
import { cn, IntemediaryToast, IntemediaryToastHeading, OpenSolScanLink, OpenToastLink } from 'gfx-component-lib'
import { toast, ToastT } from 'sonner'

const CLOSE = styled.div`
  background-color: red;
`

const MESSAGE = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 15px;
    font-weight: 600 !important;
  }
`

const DESCRIPTION = styled(MESSAGE)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;

  > span {
    width: 100%;
    font-size: 12px !important;
    font-weight: 500 !important;
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

interface SuccessResponse {
  txid: string
  slot: number
}

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
export const perpsNotify = async ({
  action,
  message,
  description,
  styles,
  key,
  duration = 10,
  loading = false
}) => {
  const openNotification = () => {
    notification.open({
      closeIcon: <CLOSE />,
      description: (
        <DESCRIPTION>
          <span>{description}</span>
        </DESCRIPTION>
      ),
      icon: <div style={{ display: 'none' }} />,
      key,
      duration: duration,
      message:
        typeof message === 'string' ? (
          <MESSAGE>
            <span>{message}</span>
          </MESSAGE>
        ) : (
          <MESSAGE>
            <span>{message}</span>
          </MESSAGE>
        ),
      onClick: () => notification.close(key),
      placement: 'bottomLeft',
      style: {
        backgroundColor: '#5855FF',
        borderRadius: '10px',
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
export const LoadingToast: FC = () => (
  <IntemediaryToast>
    <IntemediaryToastHeading stage={'loading'}>Loading...</IntemediaryToastHeading>
    <p>Please wait a few moments for the transaction to confirm...</p>
  </IntemediaryToast>
)
export const ErrorToast: FC = () => (
  <IntemediaryToast>
    <IntemediaryToastHeading stage={'error'}>Error!</IntemediaryToastHeading>
    <p className={`break-words w-full`}>
      Sorry, a problem occurred, please try again. If the issue persists contact support.
    </p>
    <OpenToastLink link={'https://discord.com/channels/833693973687173121/833725691983822918'}>
      Contact Us
    </OpenToastLink>
  </IntemediaryToast>
)
export const SuccessToast: FC<{ txId: string }> = ({ txId }) => (
  <IntemediaryToast>
    <IntemediaryToastHeading stage={'success'}>Success!</IntemediaryToastHeading>
    <p className={cn(`pt-1`)}>Congratulations, your transaction was completed!</p>
    <OpenSolScanLink link={`https://solscan.io/tx/${txId}`} />
  </IntemediaryToast>
)

export function promiseBuilder<T>(promise: Promise<T>): Promise<T | Error> {
  return new Promise((resolve, reject) => promise.then((res) => resolve(res)).catch((err) => reject(err)))
}

export const notifyUsingPromise = async (
  promise: Promise<unknown>,
  onDismiss?: (toast: ToastT) => void,
  tentativeTxId?: string
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    toast.promise(promise, {
      loading: (
        <IntemediaryToast className={cn(`w-[290px]`)}>
          <IntemediaryToastHeading stage={'loading'}>Loading...</IntemediaryToastHeading>
          <p>Please wait a few moments for the transaction to confirm...</p>
          {Boolean(tentativeTxId) && <OpenSolScanLink link={`https://solscan.io/tx/${tentativeTxId}`} />}
        </IntemediaryToast>
      ),
      success: (response: SuccessResponse) => {
        resolve(true)
        return (
          <IntemediaryToast className={cn(`w-[290px]`)}>
            <IntemediaryToastHeading stage={'success'}>Success!</IntemediaryToastHeading>
            <p className={cn(`pt-1`)}>Congratulations, your transaction was completed!</p>
            <OpenSolScanLink link={`https://solscan.io/tx/${response.txid}`} />
          </IntemediaryToast>
        )
      },
      error: (err) => {
        console.log('error', err)
        if(err.message === "6005"){
        reject(false)
          return (
            <IntemediaryToast className={cn(`w-[290px]`)}>
              <IntemediaryToastHeading stage={'error'}>Slippage error!</IntemediaryToastHeading>
              <p>
                The transaction could not go through because slippage exceeded your fixed slippage. 
                Please try again!
              </p>
              <OpenToastLink link={'https://discord.com/channels/833693973687173121/833725691983822918'}>
                Contact Us
              </OpenToastLink>
            </IntemediaryToast>
          )
        }
        reject(false)
        return (
          <IntemediaryToast className={cn(`w-[290px]`)}>
            <IntemediaryToastHeading stage={'error'}>Error!</IntemediaryToastHeading>
            <p>Sorry, a problem occurred, please try again. If the issue persists contact support.</p>
            <OpenToastLink link={'https://discord.com/channels/833693973687173121/833725691983822918'}>
              Contact Us
            </OpenToastLink>
          </IntemediaryToast>
        )
      },
      onDismiss: (toast: ToastT) => {
        if (onDismiss) onDismiss(toast)
      }
    })
  })

export const notifyUsingPromiseForFillTx = async (
  promise: Promise<unknown>,
  solAmount: string
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    toast.promise(promise, {
      loading: (
        <IntemediaryToast className={cn(`w-[290px]`)}>
          <IntemediaryToastHeading stage={'loading'}>Placing Order...</IntemediaryToastHeading>
          <p className={cn(`text-[13px]`)}>
            Please wait a few moments for the order to <br /> fill...
          </p>
        </IntemediaryToast>
      ),
      success: (response: SuccessResponse) => {
        resolve(true)
        return (
          <IntemediaryToast className={cn(`w-[290px]`)}>
            <IntemediaryToastHeading stage={'success'}>Order Filled!</IntemediaryToastHeading>
            <p className={cn(`pt-1 text-[13px]`)}>
              Your Order was Filled of <br />
              {solAmount} SOL.
            </p>
          </IntemediaryToast>
        )
      },
      error: () => {
        reject(false)
        return (
          <IntemediaryToast className={cn(`w-[290px]`)}>
            <IntemediaryToastHeading stage={'error'}>Error!</IntemediaryToastHeading>
            <p>Sorry, a problem occurred, please try again. If the issue persists contact support.</p>
            <OpenToastLink link={'https://discord.com/channels/833693973687173121/833725691983822918'}>
              Contact Us
            </OpenToastLink>
          </IntemediaryToast>
        )
      }
    })
  })

export const notifyUsingPromiseForCloseTx = async (promise: Promise<unknown>): Promise<boolean> =>
  new Promise((resolve, reject) => {
    toast.promise(promise, {
      loading: (
        <IntemediaryToast className={cn(`w-[290px]`)}>
          <IntemediaryToastHeading stage={'loading'}>Closing Position...</IntemediaryToastHeading>
          <p className={cn(`text-[13px]`)}>
            Please wait a few moments for the position to <br />
            be closed...
          </p>
        </IntemediaryToast>
      ),
      success: (response: SuccessResponse) => {
        resolve(true)
        return (
          <IntemediaryToast className={cn(`w-[290px]`)}>
            <IntemediaryToastHeading stage={'success'}>Order Closed!</IntemediaryToastHeading>
            <p className={cn(`pt-1 text-[13px]`)}>Your position was closed successfully!</p>
          </IntemediaryToast>
        )
      },
      error: () => {
        reject(false)
        return (
          <IntemediaryToast className={cn(`w-[290px]`)}>
            <IntemediaryToastHeading stage={'error'}>Error!</IntemediaryToastHeading>
            <p>Sorry, a problem occurred, please try again. If the issue persists contact support.</p>
            <OpenToastLink link={'https://discord.com/channels/833693973687173121/833725691983822918'}>
              Contact Us
            </OpenToastLink>
          </IntemediaryToast>
        )
      }
    })
  })

  export const notifyUsingPromiseForCreatePool = async (promise: Promise<unknown>): Promise<boolean> =>
    new Promise((resolve, reject) => {
      toast.promise(promise, {
        loading: (
          <IntemediaryToast className={cn(`w-[290px]`)}>
            <IntemediaryToastHeading stage={'loading'}>Creating pool...</IntemediaryToastHeading>
            <p className={cn(`text-[13px]`)}>
              Please wait a few moments for the new <br />
              pool to be created!
            </p>
          </IntemediaryToast>
        ),
        success: (response: SuccessResponse) => {
          resolve(true)
          return (
            <IntemediaryToast className={cn(`w-[290px]`)}>
              <IntemediaryToastHeading stage={'success'}>Pool Created Successfully!</IntemediaryToastHeading>
              <p className={cn(`pt-1 text-[13px]`)}>It may take a few minutes for your pool to appear on the platform. 
                Please refresh the page.</p>
            </IntemediaryToast>
          )
        },
        error: () => {
          reject(false)
          return (
            <IntemediaryToast className={cn(`w-[290px]`)}>
              <IntemediaryToastHeading stage={'error'}>Error!</IntemediaryToastHeading>
              <p>Sorry, a problem occurred, please try again. If the issue persists contact support.</p>
              <OpenToastLink link={'https://discord.com/channels/833693973687173121/833725691983822918'}>
                Contact Us
              </OpenToastLink>
            </IntemediaryToast>
          )
        }
      })
    })
