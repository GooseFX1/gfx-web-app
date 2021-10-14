import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { ArrowClicker, Modal } from '../../components'
import { ISwapToken, useTokenRegistry } from '../../context'
import { CenteredDiv, CenteredImg, SpaceBetweenDiv, SVGToWhite } from '../../styles'

const BODY = styled.div`
  height: 33vh;
  margin: 0 -${({ theme }) => theme.margins['3x']};
  overflow-y: auto;
`

const CLICKER = styled(SpaceBetweenDiv)`
  position: relative;
  width: 67%;

  > div > span {
    font-size: 16px;
    font-weight: 600;
  }

  > div:not(:last-child) {
    width: 100%;
  }

  > span {
    font-size: 10px;
    font-weight: 600;
  }
`

const CLICKER_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])}
  margin-left: ${({ theme }) => theme.margins['1x']};
  ${({ theme }) => theme.roundedBorders}
`

const INPUT = styled.div`
  position: relative;
  margin-top: ${({ theme }) => theme.margins['2x']};

  &:after {
    content: '';
    display: block;
    height: 1px;
    width: calc(100% + ${({ theme }) => theme.margins['3x']} * 2);
    margin-top: ${({ theme }) => theme.margins['2x']};
    margin-left: -${({ theme }) => theme.margins['3x']};
    background-color: ${({ theme }) => theme.text1};
  }

  input {
    height: ${({ theme }) => theme.margins['5x']};
    background-color: ${({ theme }) => theme.bg4};
    font-size: 12px;
    text-align: left;
  }
`

const MAGNIFYING_GLASS = styled(CenteredImg)`
  position: absolute;
  top: 12px;
  right: 12px;
  ${({ theme }) => theme.measurements(theme.margins['2x'])}
`

const SELECTOR = styled(CenteredDiv)<{ $height: string }>`
  position: absolute;
  height: ${({ $height }) => $height};
  width: 40%;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.grey5};
  cursor: pointer;
  z-index: 1;
`

const TOKEN = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['3x']};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.grey5};

    span {
      color: white;
    }
  }

  > div:last-child {
    ${({ theme }) => theme.flexColumnNoWrap}

    span:first-child {
      font-weight: 600;
    }

    span:last-child {
      font-size: 12px;
    }
  }

  span {
    color: ${({ theme }) => theme.text1};
  }
`

const TOKEN_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['4x'])}
  margin-right: ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.roundedBorders}
  box-shadow: 0 4px 10px 1px rgb(0 0 0 / 20%);
`

export const Selector: FC<{
  height: string
  otherToken: ISwapToken | null
  setToken: Dispatch<SetStateAction<ISwapToken | null>>
  token: ISwapToken | null
}> = ({ height, otherToken, setToken, token }) => {
  const { tokens } = useTokenRegistry()
  const [filterKeywords, setFilterKeywords] = useState('')
  const [filteredTokens, setFilteredTokens] = useState(tokens)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const r = new RegExp(filterKeywords, 'i')
    const filteredTokens = tokens.filter(
      ({ address, name, symbol }) =>
        (r.test(name) || r.test(symbol) || r.test(address)) && (!otherToken || otherToken.address !== address)
    )
    setFilteredTokens(filteredTokens)
  }, [filterKeywords, otherToken, tokens])

  return (
    <>
      <Modal setVisible={setVisible} title="Select a token" visible={visible}>
        <INPUT>
          <Input
            onChange={(x: any) => setFilterKeywords(x.target.value)}
            placeholder="Search name or paste address"
            value={filterKeywords}
          />
          <MAGNIFYING_GLASS>
            <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/magnifying_glass.svg`} alt="" />
          </MAGNIFYING_GLASS>
        </INPUT>
        <BODY>
          {filteredTokens.map(({ address, chainId, decimals, name, symbol }, index) => (
            <TOKEN
              key={index}
              onClick={async () => {
                setToken({ address, decimals, symbol })
                setVisible(false)
              }}
            >
              <TOKEN_ICON>
                <img src={`${process.env.PUBLIC_URL}/img/crypto/${symbol}.svg`} alt="" />
              </TOKEN_ICON>
              <div>
                <span>{symbol}</span>
                <span>{name}</span>
              </div>
            </TOKEN>
          ))}
        </BODY>
      </Modal>
      <SELECTOR $height={height} onClick={() => setVisible(true)}>
        <CLICKER>
          {token ? (
            <SpaceBetweenDiv>
              <span>{token.symbol}</span>
              <CLICKER_ICON>
                <img src={`${process.env.PUBLIC_URL}/img/crypto/${token.symbol}.svg`} alt="" />
              </CLICKER_ICON>
            </SpaceBetweenDiv>
          ) : (
            <span>Select a token</span>
          )}
          <ArrowClicker />
        </CLICKER>
      </SELECTOR>
    </>
  )
}
