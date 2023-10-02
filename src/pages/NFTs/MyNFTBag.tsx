import { useWallet } from '@solana/wallet-adapter-react'
import { Dropdown } from 'antd'
import React, { ReactElement, FC, useMemo, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Connect } from '../../layouts'
import { useConnectionConfig, useDarkMode, useNavCollapse, useNFTAggregator } from '../../context'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'
import { GradientText } from '../../components/GradientText'
import { PriceWithToken } from '../../components/common/PriceWithToken'
import { removeNFTFromBag } from '../../web3/nfts/utils'
import { LAMPORTS_PER_SOL_NUMBER } from '../../constants'
import Lottie from 'lottie-react'
import EmptyBagDark from '../../animations/emptyBag-dark.json'
import EmptyBagLite from '../../animations/EmptyBag-lite.json'
import { formatSOLDisplay, formatSOLNumber, notify } from '../../utils'
import { Button } from '../../components'
import { NFT_MARKETS } from '../../api/NFTs/constants'
import { confirmTransaction, getParsedAccountByMint, StringPublicKey } from '../../web3'
import { getMagicEdenBuyInstruction, getMagicEdenListing, getTensorBuyInstruction } from '../../api/NFTs'
import gfxImageService, { IMAGE_SIZES } from '../../api/gfxImageService'
import { pleaseTryAgain, successfulNFTPurchaseMsg } from './Collection/AggModals/AggNotifications'
import { getMagicEdenTokenAccount } from '../../web3/auction-house-sdk/pda'
import { callExecuteSaleInstruction } from '../../web3/auction-house-sdk/executeSale'
import { useHistory, useLocation } from 'react-router-dom'
import useBreakPoint from '../../hooks/useBreakPoint'

const BAG_WRAPPER = styled.div`
  ${tw` duration-500`}

  .ant-dropdown {
    ${tw`pl-20`}
  }
  .zeroItemBag {
    ${tw`w-[26px] h-[30px] cursor-pointer -mr-2 fixed top-6 right-24 `}
    z-index: 1000;
  }
  .nftNumber {
    color: ${({ theme }) => theme.text11} !important;
  }
  * {
    animation-duration: 0s !important;
  }
  .itemsPresentBag {
    ${tw`w-[26px] h-[30px] cursor-pointer -mr-2`}
  }
  .noOfItemsInBag {
    ${tw`absolute text-[15px] mt-1.5 ml-2 text-[#fff] font-semibold cursor-pointer`}
  }
`
const MY_BAG = styled.div`
  ${tw`w-[245px] h-[394px] rounded-[10px] dark:border-grey-2 
    sm:w-[100vw] sm:h-[auto] sm:fixed sm:left-0 sm:border-none sm:bottom-0`}

  border: 1px solid;
  background-color: ${({ theme }) => theme.bgForNFTCollection};

  .bagContainer {
    ${tw`flex flex-col pt-1 pl-[10px]`}
  }
  .emptyBag {
    transform: scale(3.2);
  }
  .nothingHere {
    ${tw`text-center text-[15px] mt-[-20px] font-semibold sm:gap-5 sm:mt-0`}
    color: ${({ theme }) => theme.text33};
  }

  .bagContentContainer {
    ${tw`h-[233px] flex flex-col sm:h-auto mb-20`}
    ${({ theme }) => theme.customScrollBar('1px')}

    .nftNumber {
      color: ${({ theme }) => theme.text4} !important;
    }
    .nftImage {
      ${tw`h-[60px] w-[60px] left-0 rounded-[5px] `}
    }
    .closeImg {
      ${tw`relative h-5 w-5  mt-[-50px] ml-[-10px] cursor-pointer `}
    }
    overflow-y: auto;
  }

  .buttonContainer {
    border-top: 1px solid ${({ theme }) => theme.tokenBorder};
    ${tw` flex flex-col bottom-2 absolute items-center justify-between w-[92%] `}
    .tokenBalanceText {
      color: #636363;
    }
    .tokenBalance {
      ${tw`flex font-semibold text-[15px] items-center`}
      color: ${({ theme }) => theme.text11};
      img {
        ${tw`h-[20px] w-[20px] ml-1`}
      }
    }
    .button {
      &:disabled {
        opacity: 1 !important;
        ${tw`dark:!bg-black-2 !bg-grey-4`}
        color: #636363;
        &:hover {
          color: #636363;
        }
      }
      &:hover {
        color: white;
      }
    }
  }
  .clearText {
    ${tw`text-[15px] font-semibold sm:mr-4 cursor-pointer`}
    color: ${({ theme }) => theme.text34}
  }
  .clearTextActive {
    ${tw`text-[15px] font-semibold sm:mr-4 cursor-pointer`}
    color: ${({ theme }) => theme.textWhitePurple}
  }
`

export const MyNFTBag = (): ReactElement => {
  const { pathname } = useLocation()

  const { mode } = useDarkMode()
  const { nftInBag } = useNFTAggregator()
  const { isCollapsed } = useNavCollapse()
  const itemsPresentInBag = Object.keys(nftInBag ? nftInBag : {}).length // no items in the bag
  const [visible, setVisible] = useState<boolean>(false)
  const history = useHistory()
  const breakpoint = useBreakPoint()

  useEffect(() => {
    if (breakpoint.isDesktop) {
      if (Object.keys(nftInBag)?.length && !visible) setVisible(true)
      if (Object.keys(nftInBag)?.length === 0) setVisible(false)
    }
  }, [nftInBag])

  useEffect(() => history.listen(() => setVisible(false)), [history])

  const handleDropdownClick = async () => {
    await setVisible((prev) => !prev)
  }
  if (!pathname.startsWith('/nfts')) return null
  if (isCollapsed) return null

  return (
    <BAG_WRAPPER>
      <Dropdown
        align={{ offset: [0, 16] }}
        destroyPopupOnHide={true}
        overlay={<MyBagContent handleDropdownClick={handleDropdownClick} />}
        trigger={['hover']}
        open={visible}
      >
        <div
          css={tw`flex items-center justify-center h-full cursor-pointer relative w-7.5 h-7.5`}
          onClick={handleDropdownClick}
        >
          <p
            css={[
              tw`mb-0 absolute top-1/4 transform -translate-x-1/2 -translate-y-1/2 text-tiny font-medium
                      text-grey-1 dark:text-white mt-0.5 h-4`
            ]}
          >
            {itemsPresentInBag}
          </p>
          {itemsPresentInBag ? (
            <img src={`/img/assets/shopping-bag-${mode}-active.svg`} />
          ) : (
            <img src={`/img/assets/shopping-bag-${mode}-inactive.svg`} />
          )}
        </div>
      </Dropdown>
    </BAG_WRAPPER>
  )
}
const MyBagContent: FC<{ handleDropdownClick: () => void }> = ({ handleDropdownClick }): ReactElement => {
  const { nftInBag, setNftInBag } = useNFTAggregator()
  const { wallet } = useWallet()
  const { mode } = useDarkMode()
  const itemsPresentInBag: number = useMemo(() => Object.keys(nftInBag ? nftInBag : {}).length, [nftInBag])

  return (
    <MY_BAG>
      <div className="bagContainer">
        <div tw="flex items-center mt-1 gap-2 sm:justify-between z-[9999]">
          <div>
            <span
              css={[
                mode === 'dark'
                  ? tw`!font-semibold text-[18px] text-grey-2`
                  : tw`!font-semibold text-[18px] text-black-4`
              ]}
            >
              My Bag
            </span>{' '}
            <span
              css={[
                mode === 'dark' && itemsPresentInBag > 0
                  ? tw`!font-semibold text-[18px] text-white`
                  : tw`!font-semibold text-[18px] text-black-4`
              ]}
            >
              ({itemsPresentInBag})
            </span>
          </div>
          <Button
            disabled={itemsPresentInBag === 0}
            disabledColor={
              mode === 'dark' ? tw`bg-black-2 !text-grey-1 !opacity-100` : tw`bg-grey-4 !text-grey-1 !opacity-100`
            }
            onClick={() => setNftInBag({})}
            height={'30px'}
            cssStyle={
              itemsPresentInBag > 0
                ? tw`bg-blue-1 font-semibold ml-2 text-white`
                : tw`bg-black-2 font-semibold ml-2 !text-grey-1`
            }
          >
            Clear All
          </Button>
          {/* <div className={itemsPresentInBag ? 'clearTextActive' : 'clearText'} onClick={() => setNftInBag({})}>
            Clear All
          </div> */}
          <div tw="ml-auto mr-[10px]" onClick={handleDropdownClick}>
            <img
              tw="h-4 w-4  z-[100] cursor-pointer"
              src={mode === 'dark' ? `/img/assets/close-white-icon.svg` : `/img/assets/close-gray-icon.svg`}
            />
          </div>
        </div>

        {itemsPresentInBag > 0 ? <ItemsPresentInBag wallet={wallet} /> : <EmptyBagDisplay />}
        <ButtonContainerForBag />
      </div>
    </MY_BAG>
  )
}

const BagTokenBalanceRow: FC<{ title: string; amount: number }> = ({ title, amount }): ReactElement => (
  <div tw={'flex items-center justify-between w-full mt-1 mb-1'}>
    <div className="tokenBalanceText" tw={'font-semibold'}>
      {title}
    </div>
    <div className="tokenBalance">
      {formatSOLDisplay(amount)}
      <img src={'/img/crypto/SOL.svg'} alt="" />
    </div>
  </div>
)

const ItemsPresentInBag: FC<{ wallet: any }> = ({ wallet }): ReactElement => {
  const { nftInBag, setNftInBag } = useNFTAggregator()

  return (
    <div className="bagContentContainer" style={{ height: wallet ? '238px' : '284px' }}>
      {Object.entries(nftInBag).map(([key, nft], index: number) => (
        <div tw="flex items-center mt-[15px] " key={index}>
          <img
            className="nftImage"
            src={gfxImageService(
              IMAGE_SIZES.SM_SQUARE,
              nftInBag[key]?.verified_collection_address
                ? nftInBag[key]?.verified_collection_address
                : nftInBag[key]?.first_verified_creator_address,
              nftInBag[key]?.image_url
            )}
            alt="img"
          />

          <img
            className="closeImg"
            onClick={() => removeNFTFromBag(nft.mint_address, setNftInBag)}
            src={`/img/assets/Aggregator/closeRed.svg`}
            alt="img"
          />

          <div tw="flex flex-col text-[15px] font-semibold">
            <div className="nftNumber">#{nftInBag[key]?.nft_name?.split('#')[1]}</div>
            <div tw="w-[78px] truncate">
              <GradientText text={nftInBag[key]?.nft_name?.split('#')[0]} fontSize={16} fontWeight={600} />
            </div>
          </div>
          <div tw="sm:ml-auto sm:mr-5">
            <PriceWithToken
              price={formatSOLDisplay(nftInBag[key]?.buyer_price)}
              token={'SOL'}
              cssStyle={tw`h-5 w-5 !mr-0`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
const EmptyBagDisplay = (): ReactElement => {
  const { mode } = useDarkMode()
  return (
    <div tw="flex items-center sm:h-auto flex-col sm:mb-[100px] h-[230px] justify-center">
      <div>
        {mode === 'dark' ? (
          <Lottie className="emptyBag" animationData={EmptyBagDark} />
        ) : (
          <Lottie className="emptyBag" animationData={EmptyBagLite} />
        )}
      </div>
      <div className="nothingHere" tw="sm:mt-[-10px]">
        Whoops.. <br />
        Nothing in here!
      </div>
    </div>
  )
}

export const callTensorAPIs = async (
  item: any | string,
  publicKey: PublicKey
): Promise<VersionedTransaction | Transaction> => {
  try {
    const res = await getTensorBuyInstruction(
      parseFloat(item.buyer_price),
      publicKey.toBase58(),
      item.wallet_key,
      item.token_account_mint_key,
      process.env.REACT_APP_JWT_SECRET_KEY
    )

    const tx = res.data?.txV0
      ? VersionedTransaction.deserialize(Buffer.from(res.data.tx.data))
      : Transaction.from(Buffer.from(res.data.txV0.data))
    return tx
  } catch (err) {
    console.log(err)
  }
}

export const callMagicEdenAPIs = async (
  item: any | string,
  publicKey: PublicKey
): Promise<VersionedTransaction | Transaction> => {
  const tokenAccount = await getMagicEdenTokenAccount(item)

  try {
    const listing_res = await getMagicEdenListing(item?.mint_address, process.env.REACT_APP_JWT_SECRET_KEY)
    const res = await getMagicEdenBuyInstruction(
      parseFloat(item.buyer_price) / LAMPORTS_PER_SOL_NUMBER,
      publicKey.toBase58(),
      item.wallet_key,
      item.token_account_mint_key,
      listing_res.data?.[0].tokenAddress ? listing_res.data?.[0].tokenAddress : tokenAccount[0].toString(),
      process.env.REACT_APP_JWT_SECRET_KEY,
      listing_res.data?.[0].expiry ? listing_res?.data[0].expiry.toString() : '-1'
    )

    const tx = VersionedTransaction.deserialize(Buffer.from(res.data.v0.txSigned.data))
    return tx
  } catch (err) {
    console.log(err)
  }
}

const ButtonContainerForBag = (): ReactElement => {
  const { wallet } = useWallet()
  const wal = useWallet()
  const { mode } = useDarkMode()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const { nftInBag, setNftInBag, setOperatingNFT } = useNFTAggregator()
  const itemsInBag = useMemo(() => Object.keys(nftInBag ? nftInBag : {}).length, [nftInBag])
  const { connection } = useConnectionConfig()
  const [userSOLBalance, setUserSOLBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const nftInArrayFormat = useMemo(() => Object.values(nftInBag), [nftInBag])

  useEffect(() => {
    const SOL = connection.getAccountInfo(publicKey)
    SOL.then((res) => setUserSOLBalance(parseFloat((res.lamports / LAMPORTS_PER_SOL).toFixed(3)))).catch((err) =>
      console.error(err)
    )
  }, [publicKey])

  const totalCost = useMemo(
    () => Object.values(nftInBag).reduce((sum, item) => sum + formatSOLNumber(item?.buyer_price), 0),
    [nftInBag]
  )

  const enoughFunds = totalCost < userSOLBalance
  const cssStyle = useMemo(() => {
    if (enoughFunds && !isLoading && itemsInBag > 0)
      return tw`mb-1 text-[15px] text-center font-semibold mx-2.5 mt-1.5 
  bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2`
    else return tw`mb-1 text-[15px] text-center font-semibold mx-2.5 mt-1.5`
  }, [isLoading, itemsInBag, enoughFunds])

  const callMagicEdenAPIs = async (item): Promise<VersionedTransaction | Transaction> => {
    const tokenAccount = await getMagicEdenTokenAccount(item)

    try {
      const listing_res = await getMagicEdenListing(item?.mint_address, process.env.REACT_APP_JWT_SECRET_KEY)
      const res = await getMagicEdenBuyInstruction(
        parseFloat(item.buyer_price) / LAMPORTS_PER_SOL_NUMBER,
        publicKey.toBase58(),
        item.wallet_key,
        item.token_account_mint_key,
        listing_res.data?.[0].tokenAddress ? listing_res.data?.[0].tokenAddress : tokenAccount[0].toString(),
        process.env.REACT_APP_JWT_SECRET_KEY,
        listing_res.data?.[0].expiry ? listing_res?.data[0].expiry.toString() : '-1'
      )

      const tx = VersionedTransaction.deserialize(Buffer.from(res.data.v0.txSigned.data))
      return tx
    } catch (err) {
      console.log(err)
    }
  }
  const callTensorAPIs = async (item): Promise<VersionedTransaction | Transaction> => {
    try {
      const res: any = await getTensorBuyInstruction(
        parseFloat(item.buyer_price),
        publicKey.toBase58(),
        item.wallet_key,
        item.token_account_mint_key,
        process.env.REACT_APP_JWT_SECRET_KEY
      )

      const tx = res.data?.txV0
        ? VersionedTransaction.deserialize(Buffer.from(res.data.tx.data))
        : Transaction.from(Buffer.from(res.data.txV0.data))

      return tx
    } catch (err) {
      console.log(err)
    }
  }

  const removeFromCartAndProcessingList = useCallback(
    (mintAddress, removeFromProcessing = false, removeFromCart = false) => {
      if (removeFromProcessing) {
        setOperatingNFT((prevSet) => {
          const newSet = new Set(prevSet)
          newSet.delete(mintAddress)
          return newSet
        })
      }
      if (removeFromCart) {
        setNftInBag((prev) => {
          const updatedData = { ...prev }
          delete updatedData[mintAddress]
          return updatedData
        })
      }
    },
    []
  )

  const handleNotifications = async (signature: string, item: any, index: number) => {
    try {
      // setting this as operating nft , for loading buttons
      const confirm = await confirmTransaction(connection, signature, 'confirmed')
      if (confirm.value.err === null) {
        notify(successfulNFTPurchaseMsg(signature, item.nft_name, formatSOLDisplay(item.buyer_price)))
        removeFromCartAndProcessingList(item?.mint_address, false, true)
      }
    } catch (error) {
      // deleting this from list of operating nft, for loading buttons
      removeFromCartAndProcessingList(item?.mint_address, true, false)
      pleaseTryAgain(true, error?.message)
    }
    if (index === 0) setIsLoading(false)
  }

  const handleAPIRequest = async (nft, key) => {
    if (nft.marketplace_name === NFT_MARKETS.TENSOR) {
      return { [key]: await callTensorAPIs(nft) }
    }
    if (nft.marketplace_name === NFT_MARKETS.MAGIC_EDEN) {
      return { [key]: await callMagicEdenAPIs(nft) }
    }

    if (nft.marketplace_name === NFT_MARKETS.GOOSE) {
      const parsedAccounts = await getParsedAccountByMint({
        mintAddress: nft.mint_address as StringPublicKey,
        connection: connection
      })
      const accountInfo = {
        token_account: parsedAccounts !== undefined ? parsedAccounts.pubkey : null,
        owner: parsedAccounts !== undefined ? parsedAccounts.owner : null
      }
      const general = {
        ...accountInfo,
        ...nft
      }
      const gooseFxTx = await callExecuteSaleInstruction(nft, general, publicKey, true, connection, wal)
      const blockhash = (await connection.getLatestBlockhash('finalized')).blockhash

      gooseFxTx.recentBlockhash = blockhash
      gooseFxTx.feePayer = publicKey
      return {
        [key]: gooseFxTx
      }
    }
    return { [key]: undefined }
  }
  const handleBulkPurchase = async () => {
    setIsLoading(true)

    const promises = Object.keys(nftInBag).map((key) => {
      setOperatingNFT((prevSet) => new Set([...Array.from(prevSet), nftInBag[key]?.mint_address]))
      return handleAPIRequest(nftInBag[key], key)
    })

    const results = await Promise.all(promises)

    const readyTx = Object.assign({}, ...results)
    const builtTxs = []

    Object.keys(readyTx).forEach((key) => {
      builtTxs.push(readyTx[key])
    })
    try {
      const signedTxs = await wal.signAllTransactions(builtTxs)
      const sentTxs = []
      for (const transaction of signedTxs) {
        const rawTransaction = transaction.serialize()
        const options = {
          skipPreflight: false,
          commitment: 'confirmed'
        }
        sentTxs.push(connection.sendRawTransaction(rawTransaction, options))
      }
      const ixResponse = (await Promise.all(sentTxs)).map((id) => ({
        txid: id,
        slot: 0
      }))

      ixResponse.map((ix, index) =>
        handleNotifications(
          ix.txid,
          nftInBag[nftInArrayFormat[index].token_account_mint_key],
          ixResponse.indexOf(ix)
        )
      )
    } catch (err) {
      setOperatingNFT(new Set())
      setIsLoading(false)
      pleaseTryAgain(true, err?.message)
    }
  }
  return (
    <div className="buttonContainer">
      {publicKey ? (
        <>
          {itemsInBag ? <BagTokenBalanceRow title="You pay:" amount={totalCost} /> : <></>}
          <BagTokenBalanceRow title="Your Balance:" amount={userSOLBalance} />
          <Button
            cssStyle={cssStyle}
            disabledColor={
              mode === 'dark' ? tw`bg-black-2 !text-grey-1 !opacity-100` : tw`bg-grey-4 !text-grey-1 !opacity-100`
            }
            height="35px"
            width="225px"
            disabled={!enoughFunds || isLoading || itemsInBag === 0}
            loading={isLoading}
            onClick={handleBulkPurchase}
          >
            {itemsInBag === 0
              ? 'Add NFTs'
              : enoughFunds
              ? `Buy now for ${totalCost?.toFixed(2)} SOL`
              : 'Insufficient SOL'}
          </Button>
        </>
      ) : (
        <>
          <BagTokenBalanceRow title="Your Balance:" amount={0} />
          <div className="connectWallet">
            <Connect customButtonStyle={[tw`w-[225px] min-md:w-[225px]`]} />
          </div>
        </>
      )}
    </div>
  )
}
export default React.memo(MyNFTBag)

// const CartButton: FC = () => {
//   const { nftInBag } = useNFTAggregator()
//   const cartSize = useMemo(() => {
//     const val = clamp(2, 0, 9)
//     return val >= 9 ? '9+' : val
//   }, [nftInBag])
//   const { mode } = useDarkMode()
//   const { pathname } = useLocation()
//   // Below is rive code for when the animation is added - some things might need to changed

//   // const rive = useRiveAnimations({
//   //   animation:'swap',
//   //   autoplay: true,
//   //   canvasWidth: 35,
//   //   canvasHeight: 35
//   // })
//   // const themeInput = useStateMachineInput(rive.rive,
//   //   RIVE_ANIMATION.cart.stateMachines.CartInteractions.stateMachineName
//   //   ,RIVE_ANIMATION.cart.stateMachines.CartInteractions.inputs.Theme)
//   // const stateInput = useStateMachineInput(rive.rive,
//   //   RIVE_ANIMATION.cart.stateMachines.CartInteractions.stateMachineName
//   //   ,RIVE_ANIMATION.cart.stateMachines.CartInteractions.inputs.State)

//   // useEffect(()=>{
//   //   if(!stateInput) return
//   //   stateInput.value=pathname.startsWith('/cart')
//   // },[pathname,stateInput])
//   // useEffect(()=>{
//   //   if(!themeInput) return
//   //   themeInput.value = mode === 'dark'
//   // },[themeInput,mode])
//   // const onHover = useCallback((e: BaseSyntheticEvent)=>{
//   //   if(pathname.startsWith('/cart'))return
//   //   stateInput.value=!stateInput.value
//   // },[stateInput,pathname])

//   const openCart = useCallback(() => {
//     // TODO: fill me in
//     console.log('FILL ME IN')
//   }, [])
//   if (!pathname.startsWith('/nfts')) return null
//   return (
//     <div css={tw`flex items-center justify-center h-full cursor-pointer relative w-7.5 h-7.5`} onClick={openCart}>
//       {/* <RiveAnimationWrapper setContainerRef={rive.setContainerRef}
//                            width={35}
//                            height={35}
//                            // onMouseEnter={onHover}
//                            // onMouseLeave={onHover}
//       > */}
//       {/* <rive.RiveComponent /> */}
//       {/* </RiveAnimationWrapper> */}
//       <img src={`/img/assets/shopping-bag-${mode}-inactive.svg`} />
//       <p
//         css={[
//           tw`mb-0 absolute top-1/4 transform -translate-x-1/2 -translate-y-1/2 text-tiny font-medium
//         text-grey-1 dark:text-white mt-0.5 h-4`
//         ]}
//       >
//         {cartSize}
//       </p>
//     </div>
//   )
// }
