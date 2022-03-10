import React, { FC, useCallback, useState } from 'react'
import { logEvent } from 'firebase/analytics'
import analytics from '../analytics'
import styled from 'styled-components'
import { Menu, MenuItem } from '../layouts/App/shared'
import { ENDPOINTS, useConnectionConfig } from '../context/settings'
import { notify } from '../utils'
import { ArrowDropdown } from './ArrowDropdown'
import { SpaceBetweenDiv } from '../styles'

const WRAPPER = styled(SpaceBetweenDiv)`
  padding: 0px ${({ theme }) => theme.margin(1.5)};
  height: 36px;
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.grey5};
  cursor: pointer;

  span {
    font-size: 12px;
    font-weight: 600;
  }
`

const Overlay = ({
  handleClick
}: {
  handleClick: (e: any, endpoint: string, endpointName: string, network: string) => void
}) => {
  return (
    <Menu>
      {ENDPOINTS.map((point, index) => {
        return (
          <MenuItem key={index} onClick={(e) => handleClick(e, point.endpoint, point.name, point.network)}>
            <span>
              {point.name} {point.network.includes('devnet') && `(${point.network})`}
            </span>
          </MenuItem>
        )
      })}
    </Menu>
  )
}

export const SelectRPC: FC = () => {
  const { endpoint, endpointName, setEndpoint } = useConnectionConfig()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }
  const handleClickForRPC = useCallback(
    (e, endpoint, endpointName, network) => {
      e.preventDefault()
      // analytics logger
      logEvent(analytics, 'rpc-selector', {
        endpoint: endpoint,
        endpointName: endpointName,
        network: network
      })
      setEndpoint(endpoint)
      setDropdownVisible(false)
      setArrowRotation(false)
      notify({ message: `Switched to  ${endpointName} (${network}) ` })
    },
    [endpoint]
  )

  return (
    <WRAPPER>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        offset={[20, 24]}
        onVisibleChange={handleClick}
        overlay={<Overlay handleClick={handleClickForRPC} />}
        visible={dropdownVisible}
      >
        <span>{endpointName}</span>
      </ArrowDropdown>
    </WRAPPER>
  )
}
