import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import React, { FC, useMemo, useState, useEffect, useRef } from 'react'
import { TOKEN_NAMES } from '../../constants'
import {
  useAccounts,
  useConnectionConfig,
  useFarmContext,
  usePriceFeedFarm,
  useTokenRegistry
} from '../../context'
import { Connect } from '../../layouts/App/Connect'
import { checkMobile, moneyFormatterWithComma, notify } from '../../utils'
import { ADDRESSES, executeDeposit, executeStake, executeUnstakeAndClaim, executeWithdraw } from '../../web3'
import { ColumnMobile, ColumnWeb } from './Columns'
import { IFarmData } from './CustomTableList'
import { ExpandedContentMobile } from './ExpandContentMobile'
import {
  Deposit,
  errorHandlingMessage,
  genericErrMsg,
  insufficientSOLMsg,
  invalidInputErrMsg,
  sslErrorMessage,
  sslSuccessfulMessage,
  successfulMessage,
  Withdraw
} from './FarmClickHandler'
import {
  INPUT_CONTAINER,
  OPERATIONS_BTN,
  STYLED_STAKED_EARNED_CONTENT,
  STYLED_DESC,
  STYLED_INPUT,
  STYLED_RIGHT_CONTENT,
  STYLED_LEFT_CONTENT,
  TABLE_ROW,
  TOKEN_OPERATIONS_CONTAINER
} from './FarmPage.styles'

const ExpandRowView: FC<{ farm: IFarmData; index: number }> = ({ farm, index }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { publicKey } = useWallet()

  return (
    <>
      <TABLE_ROW
        isOpen={isOpen}
        checkMobile={checkMobile()}
        publicKey={publicKey}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {checkMobile() ? (
          <ColumnMobile farm={farm} isOpen={isOpen} index={index} setIsOpen={setIsOpen} />
        ) : (
          <ColumnWeb farm={farm} isOpen={isOpen} index={index} setIsOpen={setIsOpen} />
        )}
      </TABLE_ROW>
      {isOpen && (
        <tr>
          <ExpandedComponent farm={farm} />
        </tr>
      )}
    </>
  )
}

const ExpandedComponent: FC<{ farm: IFarmData }> = ({ farm }: any) => {
  const DISPLAY_DECIMAL = 3
  const { name, earned, currentlyStaked, type } = farm
  const isSSL = type === 'SSL'

  const wallet = useWallet()
  const { farmDataContext, farmDataSSLContext, counter, setCounter, setOperationPending } = useFarmContext()
  const { prices, stakeAccountKey, stakeProgram, SSLProgram } = usePriceFeedFarm()
  const { network, connection } = useConnectionConfig()

  const [withdrawBtnClass, setWithdarwClass] = useState<string>('')
  const [depositBtnClass, setDepositClass] = useState<string>('')
  const [isStakeLoading, setIsStakeLoading] = useState<boolean>(false)
  const [isUnstakeLoading, setIsUnstakeLoading] = useState<boolean>(false)
  const { getUIAmount } = useAccounts()

  const tokenData = [...farmDataContext, ...farmDataSSLContext].find((farmData) => farmData.name === name)
  const tokenPrice = useMemo(() => {
    if (name === TOKEN_NAMES.USDC) {
      return prices[`${name.toUpperCase()}/USDT`]
    }
    if (name === TOKEN_NAMES.USDT) {
      return prices[`${name.toUpperCase()}/USD`]
    }
    // to get price of the token MSOL must be in upper case while to get tokenInfo address mSOL
    return prices[`${name.toUpperCase()}/USDC`]
  }, [prices[`${name.toUpperCase()}/USDC`]])

  const { getTokenInfoForFarming } = useTokenRegistry()
  const tokenInfo = useMemo(() => getTokenInfoForFarming(name), [name, wallet.publicKey])

  let userTokenBalance = useMemo(
    () => (wallet.publicKey && tokenInfo ? getUIAmount(tokenInfo.address) : 0),
    [tokenInfo?.address, getUIAmount, wallet.publicKey, counter]
  )
  const availableToMint =
    tokenData?.ptMinted >= 0 ? tokenData.currentlyStaked + tokenData.earned - tokenData.ptMinted : 0
  const availableToMintFiat = tokenPrice && availableToMint * tokenPrice.current
  const [stakeAmt, setStakeAmt] = useState<number | undefined>()
  const [unstakeAmt, setUnstakeAmt] = useState<number | undefined>()

  const [notEnoughFunds, setNotEnough] = useState<boolean>()
  const [tokenStaked, setTokenStaked] = useState<number>(parseFloat(currentlyStaked))
  const [tokenEarned, setTokenEarned] = useState<number>(parseFloat(earned))
  const tokenStakedPlusEarned = tokenEarned + tokenStaked
  const [userSOLBalance, setSOLBalance] = useState<number>()

  // refs
  const depositRef = useRef<HTMLInputElement>(null)
  const withdrawRef = useRef<HTMLInputElement>(null)
  const isMobile = checkMobile()

  const getSuccessUnstakeMsg = (): string => `Successfully Unstaked amount of ${unstakeAmt} ${name}!`
  const getSuccessStakeMsg = (): string => `Successfully staked amount of ${stakeAmt} ${name}!`
  const getErrStakeMsg = (): string => `Staking ${name} error!`
  const getErrUntakeMsg = (): string => `Unstaking ${name} error!`
  const zeroFunds =
    name === TOKEN_NAMES.SOL
      ? parseFloat(userSOLBalance?.toFixed(3)) === 0
      : parseFloat(userTokenBalance?.toFixed(3)) === 0

  useEffect(() => {
    if (wallet.publicKey && name === TOKEN_NAMES.SOL) {
      const SOL = connection.getAccountInfo(wallet.publicKey)
      SOL.then((res) => setSOLBalance(res.lamports / LAMPORTS_PER_SOL)).catch((err) => console.log(err))
    }
  }, [counter, getUIAmount, wallet.publicKey, userSOLBalance])

  useEffect(() => {
    let tokenBalance = userTokenBalance
    if (name === TOKEN_NAMES.SOL) tokenBalance = userSOLBalance
    if (parseFloat(tokenBalance?.toFixed(3)) < stakeAmt) {
      setNotEnough(true)
      setDepositClass('')
    } else {
      setNotEnough(false)
      if (stakeAmt) setDepositClass(' active')
    }
  }, [stakeAmt])

  useEffect(() => {
    setTokenStaked(parseFloat(currentlyStaked))
    setTokenEarned(parseFloat(earned))
    return null
  }, [earned, currentlyStaked])

  const onClickHalf = (buttonId: string): void => {
    if (name === TOKEN_NAMES.SOL) userTokenBalance = userSOLBalance
    if (buttonId === 'stake') {
      !isMobile && depositRef.current.focus()
      setStakeAmt(parseFloat((userTokenBalance / 2).toFixed(DISPLAY_DECIMAL)))
    } else {
      !isMobile && withdrawRef.current.focus()
      setUnstakeAmt(parseFloat(((tokenStaked + tokenEarned) / 2).toFixed(DISPLAY_DECIMAL)))
    }
  }
  const updateStakedValue = () => {
    setTokenStaked((prev) => prev + stakeAmt)
  }
  const onClickMax = (buttonId: string): void => {
    //add focus element
    if (name === TOKEN_NAMES.SOL) userTokenBalance = userSOLBalance
    if (buttonId === 'stake') {
      !isMobile && depositRef.current.focus()
      setStakeAmt(parseFloat(userTokenBalance.toFixed(DISPLAY_DECIMAL)))
    } else {
      !isMobile && withdrawRef.current.focus()
      setUnstakeAmt(parseFloat((tokenEarned + tokenStaked).toFixed(DISPLAY_DECIMAL)))
    }
  }
  const enoughSOLInWallet = (): boolean => {
    if (userSOLBalance < 0.000001) {
      notify(insufficientSOLMsg())
      return false
    }
    return true
  }
  const checkBasicConditions = (amt?: number | undefined): boolean => {
    if (!enoughSOLInWallet()) return true
    if (name === TOKEN_NAMES.SOL) userTokenBalance = userSOLBalance
    if (isNaN(stakeAmt) || stakeAmt < 0.000001 || stakeAmt > parseFloat(userTokenBalance.toFixed(3))) {
      setStakeAmt(0)
      notify(invalidInputErrMsg(amt >= 0 ? amt : userTokenBalance, name))
      return true
    }
    return false
  }

  const onClickWithdraw = (amount: number): void => {
    setIsUnstakeLoading(true)
    try {
      //const confirm =
      executeWithdraw(SSLProgram, wallet, connection, network, name, amount).then((con) => {
        setIsUnstakeLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, unstakeAmt, name, network, Withdraw))
          setCounter((prev) => prev + 1)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(name, error?.message, signature, network, Withdraw))
          return
        }
      })
    } catch (err) {
      setIsUnstakeLoading(false)
      notify(genericErrMsg(err))
    }
  }
  const checkbasicConditionsForWithdraw = (amt: number, stakeRefBool?: boolean) => {
    const userAmount = stakeRefBool ? stakeAmt : unstakeAmt
    if (
      isNaN(userAmount) ||
      userAmount < 0.000001 ||
      parseFloat(userAmount.toFixed(3)) > parseFloat(amt.toFixed(3))
    ) {
      //stakeRefBool ? (stakeRef.current.value = 0) : (withdrawRef.current.value = 0)
      notify(invalidInputErrMsg(amt >= 0 ? amt : undefined, name))
      return true
    }
    return false
  }

  const withdrawClicked = () => {
    if (checkbasicConditionsForWithdraw(availableToMint)) return
    const decimals = ADDRESSES[network]?.sslPool[name]?.decimals
    const multiplier = 10 * Math.pow(10, decimals - 6) // decimals === 9 ? 10000 : decimals === 8 ? 1000 : 10
    let amountInNative = (unstakeAmt / tokenData?.userLiablity) * LAMPORTS_PER_SOL * multiplier
    if (parseFloat(unstakeAmt.toFixed(3)) >= parseFloat(availableToMint.toFixed(3))) {
      amountInNative = 100 * 100
    }
    onClickWithdraw(amountInNative)
  }

  const onClickUnstake = (): void => {
    const tokenStakedPlusEarned = tokenStaked + tokenEarned
    if (
      isNaN(unstakeAmt) ||
      unstakeAmt < 0.01 ||
      unstakeAmt > parseFloat(tokenStakedPlusEarned.toFixed(DISPLAY_DECIMAL))
    ) {
      setUnstakeAmt(0)
      notify(invalidInputErrMsg(tokenStaked + tokenEarned, name))
      return
    }
    if (!enoughSOLInWallet()) return
    try {
      setIsUnstakeLoading(true)
      const tokenInPercent = tokenStakedPlusEarned
        ? (unstakeAmt / parseFloat(tokenStakedPlusEarned.toFixed(DISPLAY_DECIMAL))) * 100
        : 0
      setOperationPending(true)
      const confirm = executeUnstakeAndClaim(
        stakeProgram,
        stakeAccountKey,
        wallet,
        connection,
        network,
        tokenInPercent
      )
      confirm.then((con) => {
        const { confirm, signature } = con
        setIsUnstakeLoading(false)
        setOperationPending(false)
        if (confirm && confirm?.value && confirm.value.err === null) {
          updateStakedValue()
          notify(successfulMessage(getSuccessUnstakeMsg(), signature, unstakeAmt.toString(), name, network))
          setCounter((prev) => prev + 1)
          if (unstakeAmt > tokenStaked) {
            const val = tokenEarned - (unstakeAmt - tokenStaked)
            setTokenEarned(val <= 0 ? 0 : val)
          }
          const remainingToken = tokenStaked - unstakeAmt
          setTokenStaked(remainingToken > 0 ? remainingToken : 0)
          setTimeout(() => setUnstakeAmt(0), 1000)
        } else {
          const { signature, error } = con
          notify(errorHandlingMessage(getErrUntakeMsg(), name, error?.message, signature, network))
          return
        }
      })
    } catch (error) {
      setIsUnstakeLoading(false)
      notify(genericErrMsg(error))
    }
  }

  const onClickDeposit = (): void => {
    if (checkBasicConditions(availableToMint)) return
    let amount = stakeAmt
    if (amount === parseFloat(userTokenBalance.toFixed(3))) amount = userTokenBalance
    try {
      setIsStakeLoading(true)
      setOperationPending(true)
      const confirm = executeDeposit(SSLProgram, wallet, connection, network, amount, name)
      confirm.then((con) => {
        setOperationPending(false)
        setIsStakeLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, amount, name, network, Deposit))
          updateStakedValue()
          setTimeout(() => setStakeAmt(0), 500)
          setCounter((prev) => prev + 1)
        } else {
          //@ts-ignore
          const { signature, error } = con
          notify(sslErrorMessage(name, error?.message, signature, network, Deposit))
          return
        }
      })
    } catch (error) {
      setOperationPending(false)
      setIsStakeLoading(false)
      notify(genericErrMsg(error))
    }
  }
  const onClickStake = (): void => {
    if (checkBasicConditions()) return
    try {
      setIsStakeLoading(true)
      let amount = stakeAmt
      if (amount === parseFloat(userTokenBalance.toFixed(3))) amount = userTokenBalance
      const confirm = executeStake(stakeProgram, stakeAccountKey, wallet, connection, network, amount)
      confirm.then((con) => {
        setIsStakeLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(successfulMessage(getSuccessStakeMsg(), signature, stakeAmt.toString(), name, network))
          updateStakedValue()
          setCounter((prev) => prev + 1)
          setTimeout(() => setStakeAmt(0), 500)
        } else {
          const { signature, error } = con
          notify(errorHandlingMessage(getErrStakeMsg(), name, error?.message, signature, network))
          return
        }
      })
    } catch (error) {
      setIsStakeLoading(false)
      notify(genericErrMsg(error))
    }
  }

  return checkMobile() ? (
    <>
      <ExpandedContentMobile
        stakeAmt={stakeAmt}
        unstakeAmt={unstakeAmt}
        withdrawClicked={withdrawClicked}
        isStakeLoading={isStakeLoading}
        isUnstakeLoading={isUnstakeLoading}
        setStakeAmt={setStakeAmt}
        setUnstakeAmt={setUnstakeAmt}
        userSOLBalance={userSOLBalance}
        onClickHalf={onClickHalf}
        onClickMax={onClickMax}
        onClickStake={onClickStake}
        onClickUnstake={onClickUnstake}
        onClickWithdraw={onClickWithdraw}
        // TEMP_DEP_DISABLE onClickDeposit={onClickDeposit}
        notEnoughFunds={notEnoughFunds}
        zeroFunds={zeroFunds}
        depositBtnClass={depositBtnClass}
        setDepositClass={setDepositClass}
        farm={farm}
      />
    </>
  ) : (
    <TOKEN_OPERATIONS_CONTAINER colSpan={7}>
      <div className="availableToMint">
        {wallet.publicKey ? (
          <>
            <STYLED_LEFT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
              <div className="leftInner">
                {wallet.publicKey && (
                  <STYLED_STAKED_EARNED_CONTENT>
                    {isSSL ? (
                      <AvailableToMintComp
                        availableToMintFiat={availableToMintFiat}
                        availableToMint={availableToMint}
                        name={name}
                      />
                    ) : (
                      <DailyRewards tokenData={tokenData} tokenPrice={tokenPrice} name={name} />
                    )}

                    <STYLED_DESC>
                      <div className="balanceAvailable">Wallet balance:</div>
                      <div className="value">
                        {userTokenBalance?.toFixed(3)} {name}
                      </div>
                    </STYLED_DESC>
                  </STYLED_STAKED_EARNED_CONTENT>
                )}
              </div>
            </STYLED_LEFT_CONTENT>
            <STYLED_RIGHT_CONTENT className={`${wallet.publicKey ? 'connected' : 'disconnected'}`}>
              <div className="rightInner">
                <div>
                  <INPUT_CONTAINER>
                    {/*TEMP_DEP_DISABLE <STYLED_INPUT
                      placeholder={`0.00 ${name}`}
                      type="number"
                      ref={depositRef}
                      onBlur={() => setDepositClass('')}
                      onFocus={() => !zeroFunds && setDepositClass(' active')}
                      value={stakeAmt}
                      onChange={(e) => setStakeAmt(parseFloat(e.target.value))}
                    /> */}
                    <STYLED_INPUT
                      type="number"
                      ref={depositRef}
                      placeholder={`0.00 ${name}`}
                      onBlur={() => setDepositClass('')}
                      onFocus={() => !zeroFunds && setDepositClass(' active')}
                      value={!isSSL ? stakeAmt : null}
                      onChange={(e) => (!isSSL ? setStakeAmt(parseFloat(e.target.value)) : null)}
                      disabled={isSSL}
                    />
                    <div className="halfMaxText">
                      <div onClick={() => onClickHalf('stake')}>HALF</div>{' '}
                      <div onClick={() => onClickMax('stake')} className="text2">
                        MAX
                      </div>
                    </div>
                  </INPUT_CONTAINER>
                  {/* TEMP_DEP_DISABLE <OPERATIONS_BTN
                    className={depositBtnClass}
                    loading={isStakeLoading}
                    disabled={notEnoughFunds || isStakeLoading || zeroFunds}
                    onClick={() => (isSSL ? onClickDeposit() : onClickStake())}
                  >
                    {zeroFunds
                      ? `Insufficient ${name}`
                      : notEnoughFunds
                      ? 'Not enough funds'
                      : isSSL
                      ? 'Deposit'
                      : 'Stake'}
                  </OPERATIONS_BTN> */}
                  <OPERATIONS_BTN
                    className={depositBtnClass}
                    loading={isStakeLoading}
                    disabled={isSSL}
                    onClick={() => (isSSL ? onClickDeposit() : onClickStake())}
                  >
                    {zeroFunds ? `Insufficient ${name}` : notEnoughFunds ? 'Not enough funds' : 'Stake'}
                  </OPERATIONS_BTN>
                </div>

                <div>
                  <INPUT_CONTAINER>
                    <STYLED_INPUT
                      placeholder={`0.00 ${name}`}
                      ref={withdrawRef}
                      onBlur={() => setWithdarwClass('')}
                      onFocus={() =>
                        ((isSSL && availableToMint) || tokenStakedPlusEarned) && setWithdarwClass(' active')
                      }
                      value={unstakeAmt}
                      onChange={(e) => setUnstakeAmt(parseFloat(e.target.value))}
                      type="number"
                      min="0"
                      max="100"
                    />
                    <div className="halfMaxText">
                      <div onClick={() => onClickHalf('unstake')}> HALF </div>
                      <div onClick={() => onClickMax('unstake')} className="text2">
                        {' '}
                        MAX
                      </div>
                    </div>
                  </INPUT_CONTAINER>
                  <OPERATIONS_BTN
                    className={withdrawBtnClass}
                    onClick={() => (isSSL ? withdrawClicked() : onClickUnstake())}
                    loading={isUnstakeLoading}
                    disabled={isUnstakeLoading || isSSL ? !availableToMint : currentlyStaked + earned <= 0}
                  >
                    {isSSL ? (!availableToMint ? 'No funds to withdraw' : 'Withdraw') : 'Unstake and Claim'}
                  </OPERATIONS_BTN>
                </div>
              </div>
            </STYLED_RIGHT_CONTENT>
          </>
        ) : (
          <>
            <Connect />
          </>
        )}
      </div>
    </TOKEN_OPERATIONS_CONTAINER>
  )
}

const DailyRewards = ({ tokenPrice, tokenData, name }: any) =>
  tokenData?.rewards !== undefined ? (
    <div className="info-item">
      <div className="title">Daily Rewards</div>
      <div className="value">{`${tokenData?.rewards?.toFixed(3)} ${name}`}</div>
      <div className="price">{`$${(tokenPrice?.current * parseFloat(tokenData?.rewards)).toFixed(3)} USD`}</div>
    </div>
  ) : (
    <></>
  )

const AvailableToMintComp = ({ availableToMintFiat, availableToMint, name }: any) => (
  <div className="info-item">
    <div className="title">Available {name}</div>
    <div className="value">{`${moneyFormatterWithComma(availableToMint)} ${name}`}</div>
    <div className="price">{`$${moneyFormatterWithComma(availableToMintFiat)} USD`}</div>
  </div>
)

export default ExpandRowView
