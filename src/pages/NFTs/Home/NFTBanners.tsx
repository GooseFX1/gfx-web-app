import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'

const BANNER_CONTAINER = styled.div<{ showBanner: boolean }>`
  ${({ showBanner }) => css`
     ${tw`flex items-center justify-center`}
     margin-top: ${showBanner ? '15px' : 0};
     .showBanner {
        height: ${showBanner ? '180px' : '0px'};
        visibility: ${showBanner ? 'visibility' : 'hidden'};
        opacity: ${showBanner ? 1 : 0};
        transition: visibility 0s, opacity 0.5s linear;
        }
    }
 
    `}
`

const BANNER = styled.div<{ showBanner: boolean }>`
  ${({ showBanner }) => css`
    border: 1px solid;
    transition: visibility 0s, opacity 0.5s linear;
    opacity: ${showBanner ? 1 : 0} !important;
    background: pink;
    height: ${showBanner ? '182px' : '0'};
    ${tw`w-[365px] `}
  `}
`
const NFTBanners: FC<{ showBanner: boolean }> = ({ showBanner }) => {
  console.log(showBanner)

  return (
    <>
      <BANNER_CONTAINER className={showBanner ? 'showBanner' : 'closeBanner'} showBanner={showBanner}>
        <BANNER showBanner={showBanner} />
        <BANNER showBanner={showBanner} />
        <BANNER showBanner={showBanner} />
        <BANNER showBanner={showBanner} />
      </BANNER_CONTAINER>
    </>
  )
}

export default NFTBanners
