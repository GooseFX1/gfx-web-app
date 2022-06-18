import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { Input } from 'antd'
const { TextArea } = Input
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
    }
    .collectionName {
      margin-top: 15px;
      font-size: 30px;
      font-weight: 600;
      color: ${({ theme }) => theme.text4};
    }
  }
`

export const ImageContainer: FC<{ imageName: string; projectName?: string; collectionName?: string }> = ({
  imageName,
  projectName,
  collectionName
}) => {
  return (
    <PICTURE_CONTAINER>
      <div className="normal-background">
        <img className="inner-image" alt="launchpad-logo" src={`/img/assets/${imageName}.svg`} />
        {projectName ? <div className="projectName">{projectName}</div> : null}
        {collectionName ? <div className="collectionName">{collectionName}</div> : null}
      </div>
    </PICTURE_CONTAINER>
  )
}

const INPUT_WRAPPER = styled.div`
  width: 95%;
  .inp {
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.text1h};
    padding: 5px 5px;
    outline: none;
    background: none;
    width: 90%;
    font-size: 18px;
    padding-left: 0px;
  }
  .inpBorders {
    border: 1px solid ${({ theme }) => theme.text1h};
    border-radius: 15px;
    padding: 5px 5px;
    outline: none;
    background: none;
    width: 90%;
    font-size: 16px;
    padding-left: 5px;
    height: 100px;
    margin-top: 10px;
  }
  .label {
    font-size: 20px;
    font-weight: 600;
  }
  .character-limit {
    font-size: 14px;
    font-weight: 500;
    margin-top: 10px;
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
    </INPUT_WRAPPER>
  )
}
