// /api/launchpad/actions
//url: 'http://localhost:4000' + NFT_LAUNCHPAD_API_ENDPOINTS.IS_CREATOR_ALLOWED,
//url: PROD_URL + NFT_LAUNCHPAD_API_ENDPOINTS.IS_ADMIN_ALLOWED,
//const url = 'http://localhost:4000' + NFT_LAUNCHPAD_API_ENDPOINTS.UPLOAD_FILES
//const url = 'http://localhost:4000' + NFT_LAUNCHPAD_API_ENDPOINTS.SAVE_DATA
//const url = 'http://localhost:4000' + NFT_LAUNCHPAD_API_ENDPOINTS.SAVE_TRANSACTION
//const url = PROD_URL + NFT_LAUNCHPAD_API_ENDPOINTS.APPROVE_PROJECT
//const url = PROD_URL + NFT_LAUNCHPAD_API_ENDPOINTS.REJECT_PROJECT
//const res = await customClient(PROD_URL).get(`${NFT_LAUNCHPAD_API_ENDPOINTS.GET_CREATOR_PROJECT}`)

// /api/SSL/actions
//const callProdAPI = true
//const url = 'http://localhost:4000' + SSL_API_ENDPOINTS.GET_TOKEN_PRICES
//const url = 'http://localhost:4000' + SSL_API_ENDPOINTS.GET_VOLUME_APR_DATA
//const url = 'http://localhost:4000' + SSL_API_ENDPOINTS.SAVE_LIQUIDITY_DATA
//const url = 'http://192.168.29.193:4000' + ANALYTICS_API_ENDPOINTS.LOG_DATA

// {
//   /* {props.modalType === MODAL_TYPES.GOLDEN_TICKET && <GoldenTicketPopup />} */
// }
//setInterval(async () => {

// await notify({ type: 'error', message: 'Error fetching serum markets', icon: 'rate_error' }, e)
// useLocalStorageState('slippage', DEFAULT_SLIPPAGE.toString())
//outAmount - (inAmount * outAmount) / (inAmount + inTokenAmount * 10 ** tokenA.decimals)
// useEffect(() => {
//   setTokenA(null)
//   setTokenB(null)
// }, [connection])

// useEffect(() => {
//   refreshRates().then()
// }, [inTokenAmount, refreshRates, tokenA, tokenB])
//const swap = new Swap(connection)

// const poolTokenAddress = {
//   gUSDC: '7Hvq1zbYWmBpJ7qb4AZSpC1gLC95eBdQgdT3aLQyq6pG',
//   gSOL: 'CiBddaPynSdAG2SkbrusBfyrUKdCSXVPHs6rTgSEkfsV'
// }
// const userPoolTokenBalance = useMemo(
//   () => (publicKey ? getUIAmount(poolTokenAddress['g' + name]) : 0),
//   [getUIAmount, publicKey]
// )

// const mintClicked = () => {
//   if (checkbasicConditions(availableToMint)) return
//   onClickMint(availableToMint)
// }
// const burnClicked = () => {
//   if (checkbasicConditions(userPoolTokenBalance)) return
//   onClickBurn()
// }

//#Remove style that might be needed later
// const STYLED_LEFT_CONTENT = styled.div`
//   width: 23%;
//   &.connected {
//     width: 20%;
//   }
//   .left-inner {
//     display: flex;
//     align-items: center;
//   }
//   &.disconnected {
//     .left-inner {
//       max-width: 270px;
//     }
//   }
//   .farm-logo {
//     width: 60px;
//     height: 60px;
//   }
//   button {
//     width: 169px;
//     height: 52px;
//     line-height: 42px;
//     border-radius: 52px;
//     font-family: Montserrat;
//     font-size: 13px;
//     font-weight: 600;
//     text-align: center;
//     color: #fff;
//     background-color: #6b33b0 !important;
//     border-color: #6b33b0 !important;
//     margin-left: ${({ theme }) => theme.margin(4)};
//     &:hover {
//       opacity: 0.8;
//     }
//   }
// `

// const STYLED_SOL = styled.div`
//   width: 372px;
//   height: 60px;
//   border-radius: 60px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   /* padding: 0 ${({ theme }) => theme.margin(4)};
//   margin: 0 ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(1)}; */
//   .value {
//     font-family: Montserrat;
//     font-size: 22px;
//     font-weight: 500;
//     font-stretch: normal;
//     font-style: normal;
//     line-height: normal;
//     letter-spacing: normal;
//     text-align: center;
//     color: ${({ theme }) => theme.text15};
//   }
//   &.active {
//     .value {
//       color: #fff;
//       font-weight: 600;
//     }
//   }
//   .text {
//     font-family: Montserrat;
//     font-size: 15px;
//     font-weight: 600;
//     text-align: center;
//     color: ${({ theme }) => theme.text14};
//     display: flex;
//     z-index: 2;
//     margin-bottom: 6px;
//     margin-left: -100px;
//   }
//   .text-2 {
//     margin-left: ${({ theme }) => theme.margin(1.5)};
//   }
// `
// const STYLED_STAKE_PILL = styled(MainButton)`
//   width: 372px;
//   height: 44px;
//   border-radius: 51px;
//   background-color: ${({ theme }) => theme.stakePillBg};
//   line-height: 49px;
//   font-family: Montserrat;
//   font-size: 14px;
//   font-weight: 600;
//   text-align: center;
//   opacity: 0.5;
//   color: ${({ theme }) => theme.text14};
//   margin: ${({ theme }) => theme.margin(1)} ${({ theme }) => theme.margin(1.5)} 0;
//   transition: all 0.3s ease;
//   cursor: pointer;
//   &.active,
//   &:hover {
//     background: ${({ theme }) => theme.primary3};
//     color: #fff;
//     opacity: 1;
//   }
// `

// const STYLED_STAKED_EARNED_CONTENT = styled.div`
//   display: flex;
//   align-items: center;
//   margin-left: ${({ theme }) => theme.margin(4)};
//   .info-item {
//     max-width: 150px;
//     min-width: 130px;
//     margin-right: ${({ theme }) => theme.margin(7)};
//     .title,
//     .value {
//       font-family: Montserrat;
//       font-size: 20px;
//       font-weight: 600;
//       color: ${({ theme }) => theme.text7};
//     }
//     .price {
//       font-family: Montserrat;
//       font-size: 16px;
//       font-weight: 500;
//       color: ${({ theme }) => theme.text13};
//     }
//     .value,
//     .price {
//       margin-bottom: ${({ theme }) => theme.margin(0.5)};
//     }
//   }
// `
// const STYLED_IMG = styled.img`
//   transform: scale(1.3);
// `

// const STYLED_DESC = styled.div`
//   display: flex;
//   .text {
//     margin-right: ${({ theme }) => theme.margin(1)};
//     font-family: Montserrat;
//     font-size: 14px;
//     font-weight: 500;
//     color: ${({ theme }) => theme.text7};
//   }
//   .value {
//     font-family: Montserrat;
//     font-size: 14px;
//     font-weight: 600;
//     color: #fff;
//     color: ${({ theme }) => theme.text8};
//   }
// `

// const MESSAGE = styled.div`
//   margin: -12px 0;
//   font-size: 12px;
//   font-weight: 700;

//   .m-title {
//     margin-bottom: 16px;
//   }

//   .m-icon {
//     width: 20.5px;
//     height: 20px;
//   }

//   p {
//     line-height: 1.3;
//     max-width: 200px;
//   }
// `
// const MAX_BUTTON = styled.div`
//   cursor: pointer;
// `
// const ROW_DATA = styled.div`
//   width: 100%;
//   height: 75px;
//   cursor: pointer;
// `
// const STYLED_INPUT = styled.input`
//   width: 372px;
//   height: 44px;
//   background-color: ${({ theme }) => theme.solPillBg};
//   border-radius: 60px;
//   display: flex;
//   border: none;
//   align-items: center;
//   justify-content: space-between;
//   ::-webkit-outer-spin-button,
//   ::-webkit-inner-spin-button {
//     -webkit-appearance: none;
//     margin: 0;
//   }
//   padding: 0 ${({ theme }) => theme.margin(4)};
//   margin: 0 ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(1)};
//   .value {
//     font-family: Montserrat;
//     font-size: 22px;
//     font-weight: 500;
//     font-stretch: normal;
//     font-style: normal;
//     line-height: normal;
//     letter-spacing: normal;
//     text-align: center;
//     color: ${({ theme }) => theme.text15};
//   }
//   &.active {
//     .value {
//       color: #fff;
//       font-weight: 600;
//     }
//   }
//   .text {
//     font-family: Montserrat;
//     font-size: 15px;
//     font-weight: 600;
//     text-align: center;
//     color: ${({ theme }) => theme.text14};
//     display: flex;
//   }
//   .text-2 {
//     margin-left: ${({ theme }) => theme.margin(1.5)};
//   }
// `

// const STYLED_FARM_HEADER = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 10px 10px;
//   border-radius: 20px 20px 25px 25px;
//   .search-bar {
//     height: 44px;
//     margin: 0;
//     background: #000;
//     input {
//       background: #000;
//     }
//   }
//   .pools {
//     height: 44px;
//     max-width: 132px;
//     margin-left: ${({ theme }) => theme.margin(4.5)};
//     > span {
//       font-family: Montserrat;
//       font-size: 14px;
//       font-weight: 600;
//       color: #fff;
//     }
//   }
//   .live {
//     margin-left: ${({ theme }) => theme.margin(4.5)};
//   }
// `
//const baseBalance = market?.baseSplSizeToNumber(openOrder.baseTokenTotal.sub(openOrder.baseTokenFree))
//const quoteBalance = market?.quoteSplSizeToNumber(openOrder.quoteTokenTotal.sub(openOrder.quoteTokenFree))
{
  /* <Donate
                {...dataDonate}

                const 
                label={`${category === 'open-bid' ? '3.' : '4.'} Donate for charity`}
                // selectPercentage={handleSelectPercentage}
              /> */
}

// const SORT_BUTTON = styled(ButtonWrapper)`
//   height: 40px;
//   background-color: ${({ theme }) => theme.secondary2};
//   margin-right: ${({ theme }) => theme.margin(2)};
//   justify-content: space-between;
// `

// const WRAPPED_LOADER = styled.div`
//   position: relative;
//   height: 48px;
// `
// const SKELETON_SLIDER = styled.div`
//   display: flex;
//   .wrap {
//     margin: 0 ${({ theme }) => theme.margin(4)};
//   }
// `
// const getProgram = async (connection, wallet) => {
//   const wallet_t: any = wallet
//   const provider = new anchor.Provider(connection, wallet_t, anchor.Provider.defaultOptions())
//   const idl_o: any = magic_hat_idl
//   return new Program(idl_o, MAGIC_HAT_PROGRAM_V2_ID, provider)
// }

//export const GOG_TIME = 1656435600;
//export const WL_TIME = 1656437400;
//export const whiteListAddresses = [
//  '836AqkEnj1JQNW6uSULjQ7y8bGBrpQHWzPkKi8mCYkP4',
//  'Hxzy7PeS7VsqGRB5w6LhVCZaDTobeSB37bfiLLV4A7Td',
//  '7rg73mUs4otFkjxU2rbToeLDk6Z8MwSrEsd9ch9MgGPB',
//  '8HvKPDWmDPWkEydFt2br433hTP3bjsnPsgFbpPbjjxTC'
//]

//export const whiteListAddresses = ['36cf3tQCvkw6BujkPpUpwUXRi3yzHumf1xHG46jiiy3m']

// export const whiteListAddresses = [
//   '9tPEcwyqwNsrgrJHrqe6tMZYD6cx6fgSv6xA297XQsDD'
//   //'5G988QmdoPPvohLayzbuhQ9iLVaetcDj7uaYyfjWrBnh'
// ]

// export const whiteListAddressesFour = ['CqUXdhQHQuJVdch5ovonSmhpB5VYh1G5t7Wh415Pu1Ec']

// //export const whiteListAddressesOne = [
// //  '6z2V3CEZPhWLnH86gDcwc2sQ8G1QhfrvZppuDRupfskg',
// //  'CjS4pLEgrr4jZH7YpJLt7jbvTi9CMoEb9XzZ1zAtvTW1'
// //]

// export const whiteListAddressesOne = [
//   '3QiJodq6JbmhmzZ7Rf7LbtsExj2m5eMFndVw4iEPW8q2'
//   //'FshKz382QRXZVxwBwEADtjBNrcKE8hvhXmHXtosZyNnf'
//   //'CjS4pLEgrr4jZH7YpJLt7jbvTi9CMoEb9XzZ1zAtvTW1'
// ]

// const { connected, publicKey } = useWallet()
// const { setVisible: setModalVisible } = useWalletModal()
// const { getUIAmount } = useAccounts()

// const [notEnough, setNotEnough] = useState<boolean>(false)

// const REMNANT = styled.p`
//   font-size: 16px;
//   line-height: 22px;
//   color: ${({ theme }) => theme.text1};
//   text-align: center;
//   margin: 0 0 0 4px;

//   span {
//     color: #7d7d7d;
//   }
// `

// const MINT_PROGRESS = styled(Progress)<{ num: number }>`
//   width: 75%;
//   .ant-progress-outer {
//     height: 50px;
//     margin-right: 0;
//     padding-right: 0;
//     .ant-progress-inner {
//       height: 100%;
//       background-color: ${({ theme }) => theme.bg1};

//       .ant-progress-bg {
//         height: 100% !important;
//         background: linear-gradient(96.79deg, #5855ff 4.25%, #dc1fff 97.61%);
//       }
//     }
//   }
//   .ant-progress-text {
//     position: absolute;
//     top: 19px;
//     left: calc(${({ num }) => (num < 20 ? 20 : num)}% - 64px);
//   }
// `

// const MINT_PROGRESS_WRAPPER = styled.div`
//   width: 100%;
//   background-color: ${({ theme }) => theme.bg18};
//   padding: 1rem;
//   display: flex;
//   align-items: center;
//   justify-content: space-around;
//   border-radius: 15px;
// `

// Using Total Number of NFTS as denominator
// const totalEggs = 25002
// const preSale = 2148
// const purse = 10217
// const [availableEggs, setAvailableEggs] = useState<number>(purse)
// const curPurchase = useMemo(() => preSale + (purse - availableEggs), [availableEggs])
// const currentlyMintedPercentage = useMemo(() => (curPurchase / totalEggs) * 100, [curPurchase])

// Using Number of Current Minted NFTS as denominator
// const purse = 10217
// const totalEggs = purse
// const preSale = 2148
// const [availableEggs, setAvailableEggs] = useState<number>(purse)
// const curPurchase = useMemo(() => totalEggs - availableEggs, [availableEggs])
// const currentlyMintedPercentage = useMemo(() => (curPurchase / totalEggs) * 100, [curPurchase])

// const newlyMintedNFT = useMemo(() => {
//   if (location.state && location.state.newlyMintedNFT) {
//     if (props.type === 'collected')
//       notify({
//         type: 'success',
//         message: 'NFT Successfully created',
//         description: `${location.state.newlyMintedNFT.name}`,
//         icon: 'success'
//       })

//     return location.state.newlyMintedNFT
//   } else {
//     return undefined
//   }
// }, [location])

/* const liquidate = async (
  amount: number,
  pool: string,
  synth: string,
  wallet: any,
  connection: Connection,
  network: WalletAdapterNetwork
) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('No wallet detected')
  }

  const { mints, programs, pools } = ADDRESSES[network]
  const { instruction } = getPoolProgram(wallet, connection, network)
  const tx = new Transaction()

  const accounts = {
    collateralVault: await findAssociatedTokenAddress(programs.pool.address, mints.GOFX.address),
    controller: ADDRESSES[network].programs.pool.controller,
    liquidatedTokenMint: mints[synth].address,
    liquidatorCollateralAta: await findAssociatedTokenAddress(wallet.publicKey, mints.GOFX.address),
    liquidatorLiquidatedTokenAta: await findAssociatedTokenAddress(wallet.publicKey, mints[synth].address),
    liquidatorWallet: wallet.publicKey,
    listing: pools[pool].listing,
    pool: pools[pool].address,
    priceAggregator: ADDRESSES[network].programs.pool.priceAggregator,
    tokenProgram: TOKEN_PROGRAM_ID
    // victimUserAccount,
    // victimWallet
  }

  tx.add(await instruction.liquidate(new BN(amount), { accounts }))
  return await signAndSendRawTransaction(connection, tx, wallet)
} */

//const metadata = toPublicKey(programIds().metadata);
/*
    This nonce stuff doesnt work - we are doing something wrong here. TODO fix.
    if (this.editionNonce !== null) {
      this.edition = (
        await PublicKey.createProgramAddress(
          [
            Buffer.from(METADATA_PREFIX),
            metadata.toBuffer(),
            toPublicKey(this.mint).toBuffer(),
            new Uint8Array([this.editionNonce || 0]),
          ],
          metadata,
        )
      ).toBase58();
    } else {*/
// TODO: enable when using payer account to avoid 2nd popup
/*  if (maxSupply !== undefined)
      updateInstructions.push(
        setAuthority({
          target: authTokenAccount,
          currentAuthority: payerPublicKey,
          newAuthority: wallet.publicKey,
          authorityType: 'AccountOwner',
        }),
      );
*/
// TODO: enable when using payer account to avoid 2nd popup
// Note with refactoring this needs to switch to the updateMetadataAccount command
// await transferUpdateAuthority(
//   metadataAccount,
//   payerPublicKey,
//   wallet.publicKey,
//   updateInstructions,
// );

{
  /* <div className="avatar-wrapper">
          <div className="image-group">
            <div>
              <Upload className="avatar-image" listType="picture-card" maxCount={1} onChange={handleAvatar}>
                <div className="image-wrap">
                  {!avatar && (
                    <img
                      className="img-current avatar-image"
                      src={`${
                        !sessionUser.profile_pic_link || sessionUser.profile_pic_link === ''
                          ? `/img/assets/avatar.svg}`
                          : sessionUser.profile_pic_link
                      }`}
                      alt="profile"
                    />
                  )}
                  <div className="icon-upload">
                    <PlusOutlined />
                  </div>
                </div>
              </Upload>
              <div className="text">Preview</div>
            </div>
            <div className="note">
              <div>Minimum size 400x 400</div>
              <div>(Gif's work too).</div>
            </div>
          </div>
        </div> */
}
