import React, { FC, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem } from '../layouts/App/shared'
import { ENDPOINTS, useConnectionConfig } from '../context/settings'
import { notify } from '../utils'
import { ArrowDropdown } from './ArrowDropdown'
import { SpaceBetweenDiv } from '../styles'

const WRAPPER = styled(SpaceBetweenDiv)`
  padding: ${({ theme }) => theme.margin(1.5)};
  cursor: pointer;
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.grey5};
  > span {
    font-size: 12px;
    font-weight: bold;
  }
`

const ITEM = styled(MenuItem)`
  width: 140px;
  > a {
    display: flex;
    justify-content: space-between;
    width: 100%;

    > span {
      color: ${({ theme }) => theme.text1};
    }
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
          <ITEM key={index} onClick={(e) => handleClick(e, point.endpoint, point.name, point.network)}>
            <span>{`${point.name}  (${point.network})`}</span>
          </ITEM>
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
      setEndpoint(endpoint)
      setDropdownVisible(false)
      setArrowRotation(false)
      notify({ message: `Switched to  ${endpointName} (${network}) ` })
      e.preventDefault()
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
