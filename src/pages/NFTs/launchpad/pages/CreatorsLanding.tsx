import { FC } from 'react'
import { styled } from 'twin.macro'
import { PopupCustom } from '../../Popup/PopupCustom'
import { SOCIAL_MEDIAS } from '../../../../constants'
import { Row, Col } from 'antd'
import tw from 'twin.macro'
import { checkMobile } from '../../../../utils'

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
  ${tw`sm:w-[90%] sm:mb-[30px] w-1/2 text-center mt-[30px] mx-auto mb-0 text-[#636363] text-smallest`}
`

const Wrapper = styled.div`
  ${tw`sm:p-0 w-full h-full p-[75px] bg-[#eeeeee]`}

  .arrow {
    ${tw`block w-9 h-[15px] mt-[7%] mx-auto mb-0 cursor-pointer`}
  }

  .heading {
    ${tw`sm:text-[35px] text-[70px] mt-[50px] mx-auto mb-0 text-[#3c3c3c] text-center font-bold`}
  }

  #scroll-here {
    ${tw`hidden`}
  }
`

const ROW_ONE = styled.div`
  ${tw`sm:p-0 sm:pt-20 sm:flex-col-reverse sm:items-center flex flex-row justify-between p-12`}
`

const PAGE_CONTENT = styled.div<{ $index: Number }>`
  ${tw`sm:flex sm:flex-col-reverse sm:items-center sm:mt-[50px] sm:mb-[75px] justify-around mt-[140px]`}
  display: flex;
  flex-direction: ${({ $index }) => ($index % 2 === 0 ? 'row-reverse' : 'reverse')};

  .feature-img {
    ${tw`sm:h-[220px] sm:w-3/4 h-[336px] w-[384px] mt-[15px] absolute left-0`}
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
  ${tw`sm:w-[90%] sm:my-0 sm:mx-auto sm:text-center flex flex-col justify-center w-3/5`}
`

const TEXT_CONTAINER = styled.div`
  ${tw`sm:w-[90%] sm:m-6 w-[30%] text-center flex flex-col justify-start`}
`

const ANIMATION = styled.div`
  ${tw`sm:left-[10%] sm:w-full relative`}

  .one-stop-solution{
    ${tw`absolute left-0`}
  }

  .animation{
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
  ${tw`sm:text-[35px] sm:font-bold text-[#3c3c3c] text-[50px]`}

  span {
    ${tw`sm:text-[35px] sm:font-bold`}
    background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const SUBHEADER = styled.div`
  ${tw`sm:text-tiny sm:w-3/4 sm:text-center sm:my-4 sm:mx-auto mt-4 text-average text-[#636363]`}
`

const ROW_LAST = styled.div`
  ${tw`sm:mt-0 sm:block flex flex-row mt-[140px]`}
`

const SOCIAL_ICON = styled.button`
  ${tw`bg-transparent border-none`}
  img {
    ${tw`h-auto w-[18px] sm:w-[25px]`}
  }
`

const BANNER = styled.div`
  ${tw`relative`}
  .banner-img {
    ${tw`sm:mt-10 sm:rounded-half block mt-20 mb-0 mx-auto`}
  }

  .ready-to-launch {
    ${tw`sm:top-0 sm:left-[10%] absolute top-[10%] left-[8%]`}
    .ready {
      ${tw`sm:text-[38px] sm:font-semibold text-[50px] text-white font-bold`}
    }
  }

  .apply-btn {
    ${tw`absolute text-[#5855ff] bottom-[150px] left-[45%] 
    h-[70px] w-[15%] border-none rounded-[80px] text-[25px] font-semibold
    sm:bottom-[50px] sm:left-[30%] sm:h-12 sm:w-[172px] text-regular`}
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
  ${tw`mt-7`}
`

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
        onCancel={() => {
          showModal(false)
        }}
        closeIcon={
          <div>
            <img className="close-icon" src={`/img/assets/creatorsLanding/closeButton.png`} alt="" />
          </div>
        }
        footer={null}
      >
        <Wrapper>
          <ROW_ONE>
            <TEXT_HOLDER>
              <HEADER>
                One stop solution to launch your <span>NFT collection</span>.
              </HEADER>
              <SUBHEADER>
                Together we create the best and most personalized soution to launch your NFT collection.
              </SUBHEADER>
            </TEXT_HOLDER>
            <ANIMATION style={{ left: '5%' }}>
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
          </ROW_ONE>
          <img
            src="/img/assets/creatorsLanding/arrowButton.png"
            alt="arrow-down"
            className="arrow"
            onClick={() => {
              handleScroll()
            }}
          />
          <div id="scroll-here">
            <h1 className="heading">Why GooseFX?</h1>
            {feauturesToShow.map((feature, index) => (
              <PAGE_CONTENT $index={index}>
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
                height={checkMobile() ? '321' : '498'}
                width={checkMobile() ? '90%' : '100%'}
                className="banner-img"
              />
              <div className="ready-to-launch">
                <div className="ready"> Ready </div>
                <div className="ready">to Launch?</div>
              </div>
              <button onClick={() => window.open(SOCIAL_MEDIAS.nftCreatorForm)} className="apply-btn">
                Apply
              </button>
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
                Copyright © {new Date().getFullYear()} Goose Labs, Inc. All rights reserved. Certain features may
                be unavailable to your geographic location. Please refer to our{' '}
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
