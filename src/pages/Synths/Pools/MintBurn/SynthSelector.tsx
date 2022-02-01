import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { AvailableSynth, AvailableSynthsSelector } from '../shared'
import { SynthToken } from '../../SynthToken'
import { ArrowDropdown } from '../../../../components'
import { useAccounts, useSynths } from '../../../../context'
import { CenteredDiv, CenteredImg } from '../../../../styles'

const WRAPPER = styled(CenteredDiv)`
  cursor: pointer;
`

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
}> = ({ setArrowRotation, setVisible }) => {
  const { getUIAmount } = useAccounts()
  const { availableSynths, prices, setSynth } = useSynths()

  const handleClick = useCallback(
    (synth: string) => {
      setArrowRotation(false)
      setSynth(synth)
      setVisible(false)
    },
    [setArrowRotation, setSynth, setVisible]
  )

  const synths = useMemo(() => {
    const synths: [string, { address: PublicKey; balance: number; decimals: number; value: number }][] =
      availableSynths.map(([synth, { address, decimals }]) => {
        const balance = getUIAmount(address.toString())
        const value = balance * prices[synth]?.current

        return [
          synth,
          {
            address,
            balance,
            decimals,
            value
          }
        ]
      })

    synths.sort(([a, { value: va }], [b, { value: vb }]) => vb - va || a.localeCompare(b))
    return synths
  }, [availableSynths, getUIAmount, prices])

  return (
    <AvailableSynthsSelector>
      {synths.map(([synth, { balance }], index) => (
        <AvailableSynth key={index} onClick={() => handleClick(synth)}>
          <CenteredImg>
            <img src={`/img/synth/${synth}.svg`} alt="" />
          </CenteredImg>
          <span>{synth}</span>
          <span>{balance.toFixed(2)}</span>
        </AvailableSynth>
      ))}
    </AvailableSynthsSelector>
  )
}

export const SynthSelector: FC = () => {
  const { synth } = useSynths()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

  return (
    <WRAPPER onClick={handleClick}>
      <SynthToken size="large" synth={synth} />
      <ArrowDropdown
        arrowRotation={arrowRotation}
        measurements="12px"
        offset={[10, 30]}
        onVisibleChange={handleClick}
        onClick={handleClick}
        overlay={<Overlay setArrowRotation={setArrowRotation} setVisible={setVisible} />}
        visible={visible}
      />
    </WRAPPER>
  )
}
