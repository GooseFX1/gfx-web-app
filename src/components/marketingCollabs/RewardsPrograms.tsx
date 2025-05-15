import { FC, useRef } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'gfx-component-lib'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import useBreakPoint from '@/hooks/useBreakPoint'
import useBoolean from '@/hooks/useBoolean'
import { useDarkMode, useConnectionConfig } from '@/context'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const RewardsPrograms: FC = () => {
  const { userCache, updateUserCache } = useConnectionConfig()
  const { isMobile } = useBreakPoint()
  const { mode } = useDarkMode()
  const sliderRef = useRef<any>()

  const [showBanner, setShowBanner] = useBoolean(userCache.gamma.jtoRewardsBanner !== false)
  
  const handleCloseRewardsProgramsBanner = () => {
    setShowBanner.toggle()
    updateUserCache({
      gamma: {
        ...userCache.gamma,
        jtoRewardsBanner: !showBanner
      }
    })
  }

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: 'linear',
    customPaging: () => <div className="w-[8px] h-[8px] dark:bg-white bg-blue-1 rounded-full mx-auto my-2"></div>
  }

  return (
    <Accordion
      collapsible="true"
      variant="default"
      type={'multiple'}
      defaultValue={showBanner ? ['rewards'] : []}
      className="dark:bg-black-1 bg-grey-5 px-5 pt-5 max-sm:px-2.5 max-sm:pt-3.75 max-sm:pb-0"
    >
      <AccordionItem value="rewards" className="p-0">
        <AccordionTrigger onClick={handleCloseRewardsProgramsBanner}>
          <div className="flex items-center">
            <h4 className="text-h4 dark:text-grey-8 text-black-4">Rewards </h4>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-5">
          <Slider {...settings} ref={sliderRef}>
            {/* <div className={`px-1 slide`}>
              <div
                className={`relative flex ${
                  isMobile ? '' : 'gap-7 items-center'
                } w-full p-4 rounded-[4px] bg-white dark:bg-black-2
            border border-solid border-grey-1 dark:border-grey-8`}
              >
                {!isMobile && (
                  <IconWithFallback
                    src={`/img/assets/jto-rewards-${mode}.svg`}
                    alt="Boosted Rewards"
                    className="min-h-[95px] min-w-[95px] max-h-[95px] max-w-[95px] h-[95px] w-[95px]"
                  />
                )}
                <div className={isMobile ? 'max-sm:flex-col' : 'gap-7 items-center'}>
                  <h2 className="text-primary-gradient mb-3 mr-5 max-sm:order-first">
                    Earn 10K $JTO and 300K $GOFX for 30D
                  </h2>
                  <div className={isMobile ? 'max-sm:flex max-sm:items-center' : ''}>
                    {isMobile && (
                      <IconWithFallback
                        src={`/img/assets/jto-rewards-${mode}.svg`}
                        alt="JTO Boosted Rewards"
                        className="min-h-[95px] min-w-[95px] max-h-[95px] max-w-[95px] h-[95px] w-[95px]"
                      />
                    )}
                    <p className="text-black-4 dark:text-grey-8 max-sm:ml-4">
                      Add liquidity to the SOL-JITOSOL pool and earn extra $JTO for the next 30 days. Deposit to
                      start earning today!
                    </p>
                  </div>
                </div>
              </div>
            </div> */}

            <div className={`px-1 slide`}>
              <div
                className={`relative flex ${
                  isMobile ? '' : 'gap-7 items-center'
                } w-full p-4 rounded-[4px] bg-white dark:bg-black-2
            border border-solid border-grey-1 dark:border-grey-8`}
              >
                {!isMobile && (
                  <IconWithFallback
                    src={`/img/assets/frst-rewards-${mode}.svg`}
                    alt="Boosted Rewards"
                    className="min-h-[95px] min-w-[95px] max-h-[95px] max-w-[95px] h-[95px] w-[95px]"
                  />
                )}
                <div className={isMobile ? 'max-sm:flex-col' : 'gap-7 items-center'}>
                  <h2 className="text-primary-gradient mb-3 mr-5 max-sm:order-first">
                    Earn 2.5M $FSTR and 300K $GOFX for 90D
                  </h2>
                  <div className={isMobile ? 'max-sm:flex max-sm:items-center' : ''}>
                    {isMobile && (
                      <IconWithFallback
                        src={`/img/assets/frst-rewards-${mode}.svg`}
                        alt="FRST Boosted Rewards"
                        className="min-h-[95px] min-w-[95px] max-h-[95px] max-w-[95px] h-[95px] w-[95px]"
                      />
                    )}
                    <p className="text-black-4 dark:text-grey-8 max-sm:ml-4">
                      Add liquidity to the SOL-FARTCOIN pool and earn extra $FSTR for the next 90 days. Deposit to
                      start earning today!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default RewardsPrograms
