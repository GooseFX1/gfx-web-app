import { FC } from 'react'
import { styled } from 'twin.macro'
import { PopupCustom } from '../../Popup/PopupCustom'
import { SOCIAL_MEDIAS } from '../../../../constants'
import { Row, Col } from 'antd'
import tw from 'twin.macro'
import { checkMobile } from '../../../../utils'

//#region styles
const STYLED_POPUP = styled(PopupCustom)`
  ${tw`static max-w-[100vw] m-0`}
  .close-icon {
    ${tw`fixed`}
  }
  * {
    font-family: 'Montserrat';
  }
  .ant-modal-body {
    ${tw`p-0`}
    overflow-x: hidden;
  }
`

const LINK = styled.a`
  ${tw`underline`}
  color: ${({ theme }) => theme.secondary4};
  transition: color ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  &:hover {
    ${tw`underline text-[#e180ff]`}
  }
`

const TEXT = styled.div`
  ${tw`sm:w-[90%] sm:mb-[30px] text-center mt-[30px] mx-auto mb-0 text-[#636363] text-smallest `}

  a {
    ${tw`no-underline text-[#5855ff]`}
  }
`

const Wrapper = styled.div`
  ${tw`sm:p-0 w-full h-full pl-[35px] pr-0 bg-[#eeeeee]`}

  .heading {
    ${tw`sm:text-[35px] text-[70px] mt-[50px] mx-auto mb-0 text-[#3c3c3c] text-center font-bold`}
  }

  #scroll-here {
    ${tw`hidden pl-10 pr-[75px] sm:p-0`}
  }
`

const ROW_ONE = styled.div`
  ${tw`relative h-[100vh] flex flex-row justify-between overflow-hidden`}
  ${tw`sm:p-0 sm:pt-7 sm:flex-col-reverse sm:items-center sm:justify-end`}

  .arrow {
    ${tw`absolute sm:bottom-8 bottom-[75px] w-full flex justify-center`}

    .arrow-btn {
      ${tw`w-9 h-[15px] cursor-pointer`}
    }
  }
`

const PAGE_CONTENT = styled.div<{ $index: number }>`
  ${tw`flex justify-around mt-[140px]`}
  ${tw`sm:flex sm:flex-col-reverse sm:items-center sm:mt-[50px] sm:mb-[75px] `}
  flex-direction: ${({ $index }) => ($index % 2 === 0 ? 'row-reverse' : 'reverse')};

  .feature-img {
    ${tw`sm:h-[220px] sm:w-auto h-auto w-[384px] mt-[15px] absolute`}
  }
`
const feauturesToShow = [
  {
    name: 'Multicurrency Support',
    desc: 'You can now choose between $SOL and $USDC as mint currency option.',
    image: 'Multicurrency'
  },
  {
    name: 'Funds Vesting',
    desc: 'Creators can assign milestones and vesting timelines to show how they eir community post-mint.',
    image: 'fundsVesting'
  },
  {
    name: 'Multiple Tier Support',
    desc: 'Multiple wallet-based Whitelist tiers with the option to set custom prices for every different tier.',
    image: 'multipleTier'
  },
  {
    name: 'Mint Freeze Period',
    desc: 'Newly minted NFTs can be frozen in the minter’s wallet until the collection creator lifts the freeze!',
    image: 'mintFreeze'
  },
  {
    name: 'Hidden Reveal',
    desc: 'NFTs metadata is hidden upon initial mint. Allowing the creator ts to see the final assets and metadata.',
    image: 'hiddenReveal'
  }
]

const TEXT_HOLDER = styled.div`
  ${tw`sm:w-[90%] sm:my-0 sm:mx-auto sm:text-center flex flex-col justify-center`}
`

const TEXT_CONTAINER = styled.div`
  ${tw`sm:w-[90%] sm:m-6 w-[30%] text-center flex flex-col justify-center`}
`

const ANIMATION = styled.div<{ $notCentered: boolean }>`
  ${tw`sm:w-full sm:left-0 justify-center relative flex items-center`}
  left: ${({ $notCentered }) => ($notCentered ? '50px' : '0')};
  height: ${({ $notCentered }) => ($notCentered && checkMobile() ? '42vh' : '100%')};

  .one-stop-solution{
    ${tw`absolute h-[60vh] w-auto sm:h-[42vh]`}
  }

  .animation{
    width: 100%;
    height: auto;
    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;
    }
  
    @-moz-keyframes spin { 
      100% { -moz-transform: rotate(360deg); } 
    }
    @-webkit-keyframes spin { 
      100% { -webkit-transform: rotate(360deg); } 
    }
    @keyframes spin { 
      100% { 
          -webkit-transform: rotate(360deg); 
          transform:rotate(360deg); 
      } 
    }
  }
`

const TEXT_ONE = styled.div`
  ${tw`sm:text-[30px] text-[#3c3c3c] text-[50px] font-bold`}
`

const TEXT_TWO = styled.div`
  ${tw`sm:text-tiny sm:w-3/4 sm:mx-auto text-[#636363] text-[24px] mt-2.5`}
`

const HEADER = styled.div`
  ${tw`sm:text-[35px] sm:font-bold text-[#3c3c3c] text-[50px] font-bold`}

  span {
    ${tw`sm:text-[35px] font-bold`}
    background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const SUBHEADER = styled.div`
  ${tw`sm:text-tiny sm:w-3/4 sm:text-center sm:my-4 sm:mx-auto mt-4 text-average text-[#636363] font-medium`}
`

const ROW_LAST = styled.div`
  ${tw`sm:mt-0 sm:block flex flex-row mt-[140px]`}
`

const SOCIAL_ICON = styled.button`
  ${tw`bg-transparent border-none`}
  img {
    ${tw`sm:w-[25px]`}
  }
`

const BANNER = styled.div`
  ${tw`relative sm:mt-10 mt-40`}
  .banner-img {
    ${tw`sm:rounded-half sm:max-w-full block  mb-0 mx-auto max-w-[70%]`}
  }

  .ready-to-launch {
    ${tw`sm:top-2 sm:left-[10%] absolute top-[10%] left-[17%]`}
    .ready {
      ${tw`sm:text-[38px] sm:font-semibold text-[35px] text-white font-bold`}
    }
  }

  .btn-section {
    ${tw`absolute bottom-[15%] w-full flex justify-center`}
  }

  .apply-btn {
    ${tw`text-[#5855ff] bottom-[150px] left-[45%] 
    h-[60px] w-[10%] border-none rounded-[80px] text-[25px] font-semibold
    sm:bottom-[50px] sm:left-[30%] sm:h-12 sm:w-[172px] text-[20px]`}
  }
`

const FEATURE = styled.div`
  ${tw`flex flex-col text-center`}

  .header {
    ${tw`sm:text-[40px] text-[42px] font-bold`}
    background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sub-header {
    ${tw`sm:text-tiny sm:w-3/4 sm:mx-auto sm:mb-10 text-[20px] font-medium text-[#636363] mt-2.5`}
  }
`

const FOOTER = styled.div`
  ${tw`mt-7 pb-7`}
`
//#endregion

export const CreatorsLanding: FC<{
  showModal: any
}> = ({ showModal }) => {
  const handleScroll = () => {
    const element = document.getElementById('scroll-here')
    element.style.display = 'block'
    element.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <>
      <STYLED_POPUP
        width="100%"
        height="100%"
        title={null}
        visible={true}
        onCancel={() => showModal(false)}
        closeIcon={
          <div>
            <img className="close-icon" src={`/img/assets/creatorsLanding/closeButton.svg`} alt="" />
          </div>
        }
        footer={null}
      >
        <Wrapper>
          <ROW_ONE>
            <TEXT_HOLDER>
              <HEADER>
                One stop solution to {!checkMobile() && <br />}
                launch your <span>NFT collection.</span>
              </HEADER>
              <SUBHEADER>
                Together we create the best and most personalized soution to launch your NFT collection.
              </SUBHEADER>
            </TEXT_HOLDER>
            <ANIMATION $notCentered={true}>
              <img
                src="img/assets/creatorsLanding/backgroundCover.svg"
                alt="animation"
                height="450"
                width="90%"
                className="animation"
              />
              <img
                src={`/img/assets/creatorsLanding/OneStopSolution.png`}
                height="400px"
                width={!checkMobile() ? '384px' : '90%'}
                className="one-stop-solution"
              />
            </ANIMATION>
            <div className="arrow">
              <img
                src="/img/assets/creatorsLanding/arrowButton.svg"
                alt="arrow-down"
                className="arrow-btn"
                onClick={() => handleScroll()}
              />
            </div>
          </ROW_ONE>

          <div id="scroll-here">
            <h1 className="heading">Why GooseFX?</h1>
            {feauturesToShow.map((feature, index) => (
              <PAGE_CONTENT $index={index} key={index}>
                <TEXT_CONTAINER>
                  <TEXT_ONE>{feature.name}</TEXT_ONE>
                  <TEXT_TWO>{feature.desc}</TEXT_TWO>
                </TEXT_CONTAINER>
                <ANIMATION>
                  <img
                    src={
                      index % 2 === 0
                        ? '/img/assets/creatorsLanding/backgroundPurple.png'
                        : '/img/assets/creatorsLanding/backgroundOrange.png'
                    }
                    alt="animation"
                    height={checkMobile() ? '220' : '400'}
                    width={checkMobile() ? '90%' : '400'}
                    className="animation"
                  />
                  <img src={`/img/assets/creatorsLanding/${feature.image}.png`} className="feature-img" />
                </ANIMATION>
              </PAGE_CONTENT>
            ))}
            <ROW_LAST>
              <FEATURE>
                <div className="header">1 to 1</div>
                <div className="sub-header">
                  Calls to understand your needs and carter the best solution possible for your collection NFT
                  launchpad needs.
                </div>
              </FEATURE>
              <FEATURE>
                <div className="header">Negotiable Fees</div>
                <div className="sub-header">
                  We offer competitive fees compare to other launchpads, according to your projects specifications.
                </div>
              </FEATURE>
            </ROW_LAST>
            <BANNER>
              <img
                src={
                  checkMobile()
                    ? '/img/assets/creatorsLanding/readyToLaunchMobile.png'
                    : '/img/assets/creatorsLanding/readyToLaunch.svg'
                }
                height={'auto'}
                width={checkMobile() ? '90%' : '100%'}
                className="banner-img"
              />
              <div className="ready-to-launch">
                <div className="ready"> Ready </div>
                <div className="ready">to Launch?</div>
              </div>
              <div className="btn-section">
                <button onClick={() => window.open(SOCIAL_MEDIAS.nftCreatorForm)} className="apply-btn">
                  Apply
                </button>
              </div>
            </BANNER>
            <FOOTER>
              <Row justify={checkMobile() ? 'space-around' : 'center'} align="middle">
                <Col span={2}>
                  <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.medium)}>
                    <img src="/img/assets/creatorsLanding/Medium.png" alt="domain-icon" />
                  </SOCIAL_ICON>
                </Col>
                <Col span={2}>
                  <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.discord)}>
                    <img src="/img/assets/creatorsLanding/Discord.png" alt="discord-icon" />
                  </SOCIAL_ICON>
                </Col>
                <Col span={2}>
                  <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.telegram)}>
                    <img src="/img/assets/creatorsLanding/Telegram.png" alt="domain-icon" />
                  </SOCIAL_ICON>
                </Col>
                <Col span={2}>
                  <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.twitter)}>
                    <img src="/img/assets/creatorsLanding/Twitter.png" alt="twitter-icon" />
                  </SOCIAL_ICON>
                </Col>
              </Row>
              <TEXT>
                Copyright © {new Date().getFullYear()} Goose Labs, Inc. All rights reserved. Certain features may{' '}
                be unavailable {!checkMobile() && <br />} to your geographic location. Please refer to our{' '}
                <LINK href="https://docs.goosefx.io/" target="_blank" rel="noopener noreferrer">
                  Terms and condition
                </LINK>{' '}
                and{' '}
                <LINK href="https://docs.goosefx.io/" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </LINK>
              </TEXT>
            </FOOTER>
          </div>
        </Wrapper>
      </STYLED_POPUP>
    </>
  )
}
