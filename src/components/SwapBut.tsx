import React, { BaseSyntheticEvent, FC, MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { MainButton } from './../components'
import { useAccounts, useConnectionConfig, useSwap, useWalletModal } from './../context'
import { ADDRESSES } from './../web3'
import { AmountField } from '../pages/Swap/shared'
import { Selector } from '../pages/Swap/Selector'
import { Input } from 'antd'
import { InputBlock } from './InputBlock'

import { ReactElement } from 'react'
import styled from 'styled-components'
import { color } from 'echarts'

const INPUTBLOCK = styled.div<{
  $height: string
  $width: string
  $color: string
  $backgroundColor: string
  $fontSize: string
  $borderRadius: string
  $bottomMargin: string
}>`
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  color: ${({ $color }) => $color};
  font-size: ${({ $fontSize }) => $fontSize};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  margin-bottom: ${({ $bottomMargin }) => $bottomMargin};
`

export const SwapBut: FC = () => {
  return (
    <>
      <Selector height={'65px'} otherToken={null} setToken={() => {}} token={null} />
      <Input
        style={{
          height: '65px',
          width: '100%',
          color: '#fff',
          backgroundColor: '#474747',
          fontSize: '22px',
          textAlign: 'right',
          paddingRight: 25,
          borderRadius: 50
        }}
        placeholder={'00.00'}
      />
    </>
  )
}
