import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import tw from 'twin.macro'
import { useNFTCreator } from '../../../../context/nft_creator'
import { ICreatorData } from '../../../../types/nft_launchpad'

const PICTURE_CONTAINER = styled.div`
  height: 600px;
  width: 600px;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  width: 608px;
  height: 608px;
  border-radius: 20px;
  padding: 5px;
  border-width: 2px;
  .normal-background {
    background-color: ${({ theme }) => theme.bg2};
    height: 100%;
    width: 100%;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .inner-image {
      width: 160px;
      height: 160px;
      border-radius: 20px;
    }
    .projectName {
      font-size: 30px;
      font-weight: 600;
      color: ${({ theme }) => theme.text4};
      margin-top: 100px;
      text-align: center;
    }
    .collectionName {
      margin-top: 15px;
      font-size: 24px;
      text-align: center;
      font-weight: 600;
      color: ${({ theme }) => theme.text4};
    }
  }
`

export const ImageContainer: FC<{
  imageName?: string
  projectName?: string
  collectionName?: string
  fileName?: File | string
}> = ({ imageName, projectName, collectionName, fileName }) => (
  <PICTURE_CONTAINER>
    <div className="normal-background">
      {!fileName ? (
        <>
          <img className="inner-image" alt="launchpad-logo" src={`/img/assets/${imageName}.svg`} />
          {projectName ? <div className="projectName">{projectName}</div> : null}
          {collectionName ? <div className="collectionName">{collectionName}</div> : null}
        </>
      ) : (
        <img
          className="inner-image"
          alt="not fount"
          src={typeof fileName === 'string' ? fileName : URL.createObjectURL(fileName)}
        />
      )}
    </div>
  </PICTURE_CONTAINER>
)

const INPUT_WRAPPER = styled.div`
  ${tw`w-full`}
  .containerDiv {
    position: relative;
  }
  .inp {
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.text1h};
    padding: 5px 5px;
    outline: none;
    background: none;
    ${tw`w-full`}
    font-size: 18px;
    padding-left: 0px;
    //position: absolute;
  }
  .inpBorders {
    border: 1px solid ${({ theme }) => theme.text1h};
    border-radius: 15px;
    padding: 5px 5px;
    outline: none;
    background: none;
    ${tw`w-full`}
    font-size: 16px;
    padding-left: 5px;
    height: 100px;
    margin-top: 10px;
    //position: absolute;
  }
  .label {
    font-size: 20px;
    font-weight: 600;
    // position: absolute;
  }
  .character-limit {
    font-size: 14px;
    font-weight: 500;
    margin-top: 10px;
    //position: absolute;
  }
`

export const InputSection: FC<{
  placeholder?: string
  label?: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
  characterLimit?: number
  needBorders?: boolean
}> = ({ placeholder, label, value, setValue, characterLimit, needBorders }) => {
  const [inputLength, setInputLength] = useState<number>(0)
  const handleChange = (e) => {
    if (!characterLimit) setValue(e.target.value)
    else if (characterLimit && e.target.value.length <= characterLimit) {
      setValue(e.target.value)
      setInputLength(e.target.value.length)
    }
  }
  return (
    <INPUT_WRAPPER>
      <div className="containerDiv">
        {label ? <div className="label">{label}</div> : null}
        {!needBorders ? (
          <input className={'inp'} placeholder={placeholder} value={value} onChange={handleChange} />
        ) : (
          <textarea className={'inpBorders'} placeholder={placeholder} value={value} onChange={handleChange} />
        )}
        {characterLimit ? (
          <div className="character-limit">
            {inputLength + ''} of {characterLimit} characters limit{' '}
          </div>
        ) : null}
      </div>
    </INPUT_WRAPPER>
  )
}

const NEXT_BUTTON_WRAPPER = styled.div`
  ${tw`mt-20 flex items-end justify-end`}
  .ant-btn {
    ${tw`rounded-3xl w-60 h-14 text-lg`}
  }
  .ant-btn.disabledButton {
    background-color: ${({ theme }) => theme.inputFence};
    color: ${({ theme }) => theme.text11};
  }
  .ant-btn.activeButton {
    background-color: ${({ theme }) => theme.primary3};
    color: #eeeeee;
  }
`

export const NextStepsButton: FC<{
  active: boolean
  data: ICreatorData[1] | ICreatorData[2] | ICreatorData[3] | ICreatorData[4] | ICreatorData[5]
}> = ({ active, data }) => {
  const { nextStep, saveDataForStep } = useNFTCreator()
  const handleClick = () => {
    saveDataForStep(data)
    nextStep()
  }
  return (
    <NEXT_BUTTON_WRAPPER>
      <Button className={active ? 'activeButton' : 'disabledButton'} disabled={!active} onClick={handleClick}>
        Next Steps
      </Button>
    </NEXT_BUTTON_WRAPPER>
  )
}
export const ReviewButton: FC<{
  active: boolean
  data: ICreatorData[1] | ICreatorData[2] | ICreatorData[3] | ICreatorData[4] | ICreatorData[5]
  setSubmitPopup: any
}> = ({ active, data, setSubmitPopup }) => {
  const { saveDataForStep } = useNFTCreator()
  const handleClick = () => {
    saveDataForStep(data)
    setSubmitPopup(true)
  }
  return (
    <NEXT_BUTTON_WRAPPER>
      <Button className={active ? 'activeButton' : 'disabledButton'} disabled={!active} onClick={handleClick}>
        Review
      </Button>
    </NEXT_BUTTON_WRAPPER>
  )
}
