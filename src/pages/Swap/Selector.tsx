import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'
import { ArrowClickerWhite, Modal } from '../../components'
import { ISwapToken, useTokenRegistry, useDarkMode, useConnectionConfig, useSwap } from '../../context'
import { CenteredDiv, CenteredImg, SpaceBetweenDiv, SVGToWhite } from '../../styles'

const BODY = styled.div`
  height: 33vh;
  margin: 0 -${({ theme }) => theme.margin(3)};
  overflow-y: auto;
`

const CLICKER = styled(SpaceBetweenDiv)`
  position: relative;
  width: 100%;
  padding: ${({ theme }) => theme.margin(1.5)};
  align-items: flex-center;
  color: ${({ theme }) => theme.white};

  > div:not(:last-child) {
    width: 100%;
  }
`
const MainTokenDisplay = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .text-primary {
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    padding-left: ${({ theme }) => theme.margin(1)};
  }
`

const CLICKER_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(4))}
  margin-right: ${({ theme }) => theme.margin(0.5)};
  ${({ theme }) => theme.roundedBorders}
`

const EmptyMessage = styled.span`
  align-self: center;
  font-weight: 600;
  font-size: 12.5px;
  line-height: 15px;
`

const INPUT = styled.div`
  position: relative;
  margin-top: ${({ theme }) => theme.margin(2)};
  color: ${({ theme }) => theme.text1};

  &:after {
    content: '';
    display: block;
    height: 1px;
    width: calc(100% + ${({ theme }) => theme.margin(3)} * 2);
    margin-top: ${({ theme }) => theme.margin(2)};
    margin-left: -${({ theme }) => theme.margin(3)};
    background-color: ${({ theme }) => theme.text1};
  }

  input {
    height: ${({ theme }) => theme.margin(5)};
    background-color: ${({ theme }) => theme.bg4};
    font-size: 12px;
    text-align: left;
    color: ${({ theme }) => theme.text1};
    &::placeholder {
      color: ${({ theme }) => theme.text9};
    }
  }
`

const MAGNIFYING_GLASS = styled(CenteredImg)`
  position: absolute;
  top: 12px;
  right: 12px;
  ${({ theme }) => theme.measurements(theme.margin(2))}
`

const SELECTOR = styled(CenteredDiv)<{ $height: string }>`
  position: absolute;
  top: 2px;
  left: 4px;
  height: 50px;
  width: 164px;
  margin: 0.9% 0.25rem 0.9% 0.25rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => '#2a2a2a'};
  cursor: pointer;
  z-index: 1;

  @media (max-width: 500px) {
    top: 4px;
    left: 4px;
    width: 140px;
  }
`
//box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

const TOKEN = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(3)};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.bg4};
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
`

const TOKEN_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(4))}
  margin-right: ${({ theme }) => theme.margin(2)};
  ${({ theme }) => theme.roundedBorders}
  box-shadow: 0 4px 10px 1px rgb(0 0 0 / 20%);
`

const TOKEN_INFO = styled.div`
  color: ${({ theme }) => theme.text1};
`

interface NewTokenInfo extends TokenInfo {
  imageURL?: string
}

export const Selector: FC<{
  height: string
  otherToken: ISwapToken | null
  setToken: Dispatch<SetStateAction<ISwapToken | null>>
  token: ISwapToken | null
  balance?: number
}> = ({ height, otherToken, setToken, token, balance }) => {
  const { mode } = useDarkMode()
  const { tokens } = useTokenRegistry()
  const { tokenA, tokenB } = useSwap()
  const { chainId } = useConnectionConfig()
  const [filterKeywords, setFilterKeywords] = useState('')
  const [visible, setVisible] = useState(false)
  const r = new RegExp(filterKeywords, 'i')
  const [updatedTokens, setUpdatedTokens] = useState(
    tokens.map((tk) => ({
      ...tk,
      imageURL: `/img/crypto/${tk.symbol}.svg`
    }))
  )
  const [filteredTokens, setFilteredTokens] = useState<NewTokenInfo[]>(updatedTokens)

  useEffect(() => {
    setUpdatedTokens(
      tokens.map((tk) => ({
        ...tk,
        imageURL: `/img/crypto/${tk.symbol}.svg`
      }))
    )
  }, [tokens])

  useEffect(() => {
    const altTokens = JSON.parse(window.localStorage.getItem('myAddedTokenList')) || []
    const tokenList = [...updatedTokens]
    tokenList.push(...altTokens)

    async function addAndFilterTokens() {
      if (tokenList.length < 1 && tokenA && tokenB) {
        const chainList = (await new TokenListProvider().resolve()).filterByChainId(chainId).getList()
        const filteredTokensListAlt = chainList.filter(({ address }) => filterKeywords === address)

        if (filteredTokensListAlt.length > 0) {
          tokenList.push({
            ...filteredTokensListAlt?.[0],
            imageURL: `/img/crypto/${filteredTokensListAlt?.[0].symbol}.svg`
          })
          window.localStorage.setItem('myAddedTokenList', JSON.stringify([...altTokens, filteredTokensListAlt?.[0]]))
        }
      }

      const filteredTokensList = tokenList
        .filter(
          ({ address, name, symbol }) =>
            (r.test(name.split('(')[0]) || r.test(symbol) || filterKeywords === address) && //the split by "(" is to remove every string in name of token with (Portal) or (Sollet) or any other.
            (!otherToken || otherToken.address !== address)
        )
        .sort((a, b) => {
          let fa = a.symbol.toLowerCase(),
            fb = b.symbol.toLowerCase()

          if (fa < fb) {
            return -1
          }
          if (fa > fb) {
            return 1
          }
          return 0
        })

      setFilteredTokens(filteredTokensList)
    }

    addAndFilterTokens() //(O)3n to (O)2n in time complexity (due to two loops, one filter and one sort)
  }, [filterKeywords, updatedTokens, tokenA, tokenB, chainId])

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
            {mode === 'dark' ? (
              <SVGToWhite src={`/img/assets/magnifying_glass.svg`} alt="token-search-icon" />
            ) : (
              <img src={`/img/assets/magnifying_glass.svg`} alt="token-search-icon" />
            )}
          </MAGNIFYING_GLASS>
        </INPUT>
        <BODY>
          {filteredTokens.map(({ address, chainId, decimals, name, symbol, imageURL, logoURI }, index) => (
            <TOKEN
              key={index}
              onClick={async () => {
                setToken({ address, decimals, symbol, name, logoURI })
                setVisible(false)
              }}
            >
              <TOKEN_ICON>
                <img
                  src={imageURL || logoURI}
                  alt="token-icon"
                  onError={(e) => (e.currentTarget.src = logoURI || '/img/crypto/Unknown.svg')}
                />
              </TOKEN_ICON>
              <TOKEN_INFO>
                <span>{symbol}</span>
                <span>{name}</span>
              </TOKEN_INFO>
            </TOKEN>
          ))}
        </BODY>
      </Modal>
      <SELECTOR $height={height} onClick={(e) => setVisible(true)}>
        <CLICKER>
          {token ? (
            <MainTokenDisplay>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CLICKER_ICON>
                  <img
                    src={`/img/crypto/${token.symbol}.svg`}
                    alt="active-icon"
                    onError={(e) => (e.currentTarget.src = token.logoURI || '/img/crypto/Unknown.svg')}
                  />
                </CLICKER_ICON>
                <span className={'text-primary'}>{token.symbol}</span>
              </div>
            </MainTokenDisplay>
          ) : (
            <EmptyMessage>Select a token</EmptyMessage>
          )}
          <ArrowClickerWhite />
        </CLICKER>
      </SELECTOR>
    </>
  )
}
