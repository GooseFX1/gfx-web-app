import React from 'react'
import tw from 'twin.macro'
import Button from '../../twComponents/Button'

function TopLinks(): JSX.Element {
  return (
    <div css={[tw`flex gap-4 w-full items-center justify-start`]}>
      {/*<AnimatedButtonGroup containerStyle={[tw`flex flex-row gap-2 font-semibold text-tiny`]}*/}
      {/*  animatedButtonStyle={[tw`bg-blue-1 `]}*/}
      {/*>*/}
      {/*  <Button classes={[panelIndex==0 && tw`dark:text-white text-blue-1`]}*/}
      {/*          onClick={() => console.log("1")}>Rewards</Button>*/}
      {/*  <Button  classes={[panelIndex==1 && tw`dark:text-white text-blue-1`]}*/}
      {/*           onClick={() => console.log("2")}>Referral</Button>*/}
      {/*  <Button classes={[panelIndex==2 && tw`dark:text-white text-blue-1`]}*/}
      {/*    onClick={() => console.log("3")}>Raffle</Button>*/}
      {/*</AnimatedButtonGroup>*/}
      <Button
        cssClasses={[
          tw`border-1 border-solid dark:border-white border-blue-1 text-blue-1 dark:text-white font-semibold
                 text-tiny`
        ]}
        onClick={() => window.open('https://docs.goosefx.io/tokenomics/stake-rewards-and-fee-share', '_blank')}
      >
        How it Works?
      </Button>
    </div>
  )
}

export default TopLinks
