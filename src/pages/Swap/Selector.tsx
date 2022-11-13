import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'
import { ArrowClickerWhite, Modal } from '../../components'
import { ISwapToken, useTokenRegistry, useDarkMode, useConnectionConfig, useSwap } from '../../context'
import { CenteredDiv, CenteredImg, SpaceBetweenDiv, SVGToWhite } from '../../styles'
import { POPULAR_TOKENS } from '../../constants'
import { checkMobile } from '../../utils'

import tw from 'twin.macro'

const BODY = styled.div`
  height: 33vh;
  margin: 0 -${({ theme }) => theme.margin(3)};
  overflow-y: auto;
`

const SELECTOR_MODAL = styled(Modal)`
  ${tw`w-[40vw]! sm:w-full!`}
  background-color: ${({ theme }) => theme.bg20 + '!important'};
`

const SELECTOR_INPUT = styled(Input)`
  border-radius: 1rem;
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
  border-radius: 1rem;

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

  span {
    cursor: pointer;
    margin-left: -24px;
    color: ${({ theme }) => theme.text1};
  }
`

const SELECTOR = styled(CenteredDiv)<{ $height: string }>`
  position: absolute;
  top: 2px;
  left: 4px;
  height: 50px;
  width: 200px;
  margin: 0.9% 0.25rem 0.9% 0.25rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  ${({ theme }) => theme.roundedBorders}
  cursor: pointer;
  z-index: 1;
  background-color: ${({ theme }) => theme.bg21};

  @media (max-width: 500px) {
    top: 4px;
    left: 4px;
    width: 140px;
  }
`

const POP_TEXT = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  font-weight: 600;
  margin: 0.35rem;
`

const POPULAR = styled.div`
  display: flex;
  justify-content: space-around;
  align-content: center;
  padding: 0rem;
  flex-wrap: wrap;

  &:after {
    content: '';
    display: block;
    height: 1px;
    width: calc(100% + ${({ theme }) => theme.margin(3)} * 2);
    margin-top: ${({ theme }) => theme.margin(2)};
    margin-left: -${({ theme }) => theme.margin(3)};
    background-color: ${({ theme }) => theme.tokenBorder};
  }
`

const TOKEN = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(3)};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.bg9};
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

const POPULAR_TK = styled(TOKEN)`
  ${tw`w-[96px]! rounded-lg sm:w-full flex justify-center h-[50px] mb-0 mt-1 mx-0`}
  border: ${({ theme }) => '1.5px solid ' + theme.tokenBorder};
  background-color: ${({ theme }) => theme.bg2};
  padding: 8px;

  img {
    height: 30px !important;
    width: 30px !important;
  }
  span {
    font-weight: 600;
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
  font-weight: 600;
`

const DESK_TOKEN_INFO = styled(TOKEN_INFO)`
  display: flex;
  align-items: center;
  flex-direction: row !important;

  .token-name {
    color: ${({ theme }) => theme.text20};
    margin-left: 0.25rem;
  }
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
}> = ({ height, otherToken, setToken, token }) => {
  const { mode } = useDarkMode()
  const { tokens } = useTokenRegistry()
  const { tokenA, tokenB, CoinGeckoClient, coingeckoTokens } = useSwap() //CoinGeckoClient
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
  const popularTokens = updatedTokens.filter((i) => POPULAR_TOKENS.includes(i.symbol))
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
          window.localStorage.setItem(
            'myAddedTokenList',
            JSON.stringify([...altTokens, filteredTokensListAlt?.[0]])
          )
        }
      }

      const filteredTokensList = tokenList
        .filter(
          ({ address, name, symbol }) =>
            (r.test(name.split('(')[0]) || r.test(symbol) || filterKeywords === address) &&
            //the split by "(" is to remove every string in name of token with (Portal) or (Sollet) or any other.
            (!otherToken || otherToken.address !== address)
        )
        .sort((a, b) => {
          const fa = a.symbol.toLowerCase(),
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

      if (filterKeywords.length > 1) {
        //allow at least two inputs to allow less tokens being mapped and decrease load time for popular tokens
        const popularityFilteredTokensList = (
          await Promise.all(
            filteredTokensList.map(async (tk) => {
              const token = coingeckoTokens.find((i) => i.symbol.toLowerCase() === tk.symbol.toLowerCase())
              try {
                if (!token) return { ...tk, vol: 0 }
                const data = await CoinGeckoClient.coins.fetch(token?.id || null, {})
                const res = Math.floor(data?.data?.market_data?.total_volume?.usd || 0)
                return { ...tk, vol: !isNaN(res) ? res : 0 }
              } catch {
                return { ...tk, vol: 0 }
              }
            })
          )
        ).sort((a, b) => b.vol - a.vol)
        setFilteredTokens(popularityFilteredTokensList)
      }
    }

    addAndFilterTokens() //(O)3n to (O)2n in time complexity (due to two loops, one filter and one sort)
  }, [filterKeywords, updatedTokens, tokenA, tokenB, chainId])

  return (
    <>
      <SELECTOR_MODAL setVisible={setVisible} title="Select a token" visible={visible}>
        <INPUT>
          <SELECTOR_INPUT
            onChange={(x: any) => setFilterKeywords(x.target.value)}
            placeholder="Search name or paste address"
            value={filterKeywords}
          />
          <MAGNIFYING_GLASS>
            {filterKeywords.length > 0 ? (
              <span onClick={() => setFilterKeywords('')}> Cancel </span>
            ) : mode === 'dark' ? (
              <SVGToWhite src={`/img/assets/magnifying_glass.svg`} alt="token-search-icon" />
            ) : (
              <img src={`/img/assets/magnifying_glass.svg`} alt="token-search-icon" />
            )}
          </MAGNIFYING_GLASS>
        </INPUT>
        <POP_TEXT>Most Popular</POP_TEXT>
        <POPULAR>
          {popularTokens.map(({ address, decimals, name, symbol, imageURL, logoURI }, index) => (
            <POPULAR_TK
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
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    if (e.currentTarget.src === logoURI) {
                      e.currentTarget.src = '/img/crypto/Unknown.svg'
                    } else {
                      e.currentTarget.src = logoURI || '/img/crypto/Unknown.svg'
                    }
                  }}
                />
              </TOKEN_ICON>
              <TOKEN_INFO>
                <span>{symbol}</span>
              </TOKEN_INFO>
            </POPULAR_TK>
          ))}
        </POPULAR>
        <BODY>
          {filteredTokens.map(({ address, decimals, name, symbol, imageURL, logoURI }, index) => (
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
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    if (e.currentTarget.src === logoURI) {
                      e.currentTarget.src = '/img/crypto/Unknown.svg'
                    } else {
                      e.currentTarget.src = logoURI || '/img/crypto/Unknown.svg'
                    }
                  }}
                />
              </TOKEN_ICON>
              {checkMobile() ? (
                <TOKEN_INFO>
                  <span>{symbol}</span>
                  <span>{name}</span>
                </TOKEN_INFO>
              ) : (
                <DESK_TOKEN_INFO>
                  <span>{symbol}</span>
                  <span className="token-name"> ( {name.replaceAll('(', '').replaceAll(')', '')} )</span>
                </DESK_TOKEN_INFO>
              )}
            </TOKEN>
          ))}
        </BODY>
      </SELECTOR_MODAL>
      <SELECTOR $height={height} onClick={() => setVisible(true)}>
        <CLICKER>
          {token ? (
            <MainTokenDisplay>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CLICKER_ICON>
                  <img
                    src={`/img/crypto/${token.symbol}.svg`}
                    alt="active-icon"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      if (e.currentTarget.src === token.logoURI) {
                        e.currentTarget.src = '/img/crypto/Unknown.svg'
                      } else {
                        e.currentTarget.src = token.logoURI || '/img/crypto/Unknown.svg'
                      }
                    }}
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
