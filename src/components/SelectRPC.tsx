import { useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem } from '../layouts/App/shared'
import { ENDPOINTS, useConnectionConfig, useDarkMode } from '../context'
import { ArrowDropdown } from './ArrowDropdown'
import { SpaceBetweenDiv } from '../styles'

const WRAPPER = styled(SpaceBetweenDiv)<{ mode: string }>`
  padding: 0px ${({ theme }) => theme.margin(2)};
  height: 40px;
  margin: 6px 0 4px;
  background-color: ${({ theme }) => theme.bg10};
  border-color: ${({ theme }) => theme.bg10};
  cursor: pointer;
  ${({ theme }) => theme.largeBorderRadius};

  .arrow-icon {
    filter: ${({ theme, mode }) => (mode === 'dark' ? 'invert' : 'brightness(1)')};
  }

  span {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text4} !important;
  }

  &:hover span {
    color: ${({ theme }) => theme.text4} !important;
  }
`

const CHILDREN = styled.div`
  width: ${({ theme }) => theme.margin(23.75)};
`

const RPCMenu = styled(Menu)`
  width: ${({ theme }) => theme.margin(30.75)};
`

const Overlay = ({
  handleClick
}: {
  handleClick: (e: any, endpoint: string, endpointName: string, network: string) => void
}) => {
  return (
    <RPCMenu>
      {ENDPOINTS.map((point, index) => {
        return (
          <MenuItem key={index} onClick={(e) => handleClick(e, point.endpoint, point.name, point.network)}>
            <span>
              {point.name} {point.network.includes('devnet') && `(${point.network})`}
            </span>
          </MenuItem>
        )
      })}
    </RPCMenu>
  )
}

export const SelectRPC = ({
  handleClickForRPC,
  isCustomNode
}: {
  handleClickForRPC: (endpoint: string, endpointName: string, network: string) => void
  isCustomNode: boolean
}) => {
  const { endpointName } = useConnectionConfig()
  const [RPCEndpoint, setRPCEndpoint] = useState(endpointName)
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const { mode } = useDarkMode()

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  const clickForRPC = (e, endpoint, endpointName, network) => {
    e.preventDefault()
    setRPCEndpoint(endpointName)
    setDropdownVisible(false)
    setArrowRotation(false)
    handleClickForRPC(endpoint, endpointName, network)
  }

  return (
    <WRAPPER mode={mode}>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        offset={[20, 24]}
        onVisibleChange={handleClick}
        overlay={<Overlay handleClick={clickForRPC} />}
        visible={dropdownVisible}
      >
        <CHILDREN>
          <span>{isCustomNode ? 'Custom' : RPCEndpoint}</span>
        </CHILDREN>
      </ArrowDropdown>
    </WRAPPER>
  )
}
