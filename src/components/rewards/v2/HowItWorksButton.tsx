import tw from 'twin.macro'
import Button from '../../twComponents/Button'
import React from 'react'

function HowItWorksButton(): JSX.Element {
  return (
    <Button
      cssClasses={[
        tw`border-1 border-solid dark:border-white border-blue-1 text-blue-1 dark:text-white font-semibold
                 text-tiny`
      ]}
      onClick={() => window.open('https://docs.goosefx.io/tokenomics/stake-rewards-and-fee-share', '_blank')}
    >
      How it Works?
    </Button>
  )
}

export default HowItWorksButton
