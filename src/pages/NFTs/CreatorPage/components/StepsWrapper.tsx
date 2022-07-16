import React, { FC } from 'react'
import styled from 'styled-components'
import { useNFTCreator } from '../../../../context/nft_creator'
import { Step1 } from '../steps/Step1'
import { Step2 } from '../steps/Step2'
import { Step3 } from '../steps/Step3'
import { Step4 } from '../steps/Step4'
import { Step5 } from '../steps/Step5'

const STEP_BAR = styled.div`
  display: flex;
  //justify-content: center;
  align-items: center;
  margin-top: 80px;
  padding-right: 60px;
  font-size: 22px;
  .step-label {
    margin-left: auto;
    margin-bottom: 30px;
    .gradient-color {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
`

export const StepsWrapper: FC = () => {
  const { currentStep } = useNFTCreator()
  let jsx = null
  switch (currentStep) {
    case 1:
      jsx = <Step1 />
      break
    case 2:
      jsx = <Step2 />
      break
    case 3:
      jsx = <Step3 />
      break
    case 4:
      jsx = <Step4 />
      break
    case 5:
      jsx = <Step5 />
      break
  }
  return (
    <>
      <STEP_BAR>
        <div className="step-label">
          <span className="gradient-color">Step {currentStep}</span> of 5
        </div>
      </STEP_BAR>
      {jsx}
    </>
  )
}
