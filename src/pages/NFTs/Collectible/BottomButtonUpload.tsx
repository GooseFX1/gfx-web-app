import React, { FC } from 'react'
import styled from 'styled-components'
import DropdowButton from '../../../layouts/App/DropDownButton'
import { MainText } from '../../../styles'
import { colors } from '../../../theme'
import { ButtonWrapper } from '../NFTButton'

export enum BottomButtonUploadType {
  text,
  category,
  plus,
  add_more
}

const UPLOAD_FIELD_WRAPPER = styled.div<{ flex?: number }>`
  display: flex;
  flex: ${({ flex }) => flex || 1};
  flex-direction: column;
  margin-top: ${({ theme }) => theme.margins['2.5x']};
  margin-right: ${({ theme }) => theme.margins['2.5x']};

  .category {
    background-color: ${({ theme }) => theme.btnIconBg} !important;
  }
`

const TITLE = MainText(styled.span`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.text8} !important;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.margins['1x']};
`)

const BUTTON_PLUS_WRAPPER = styled(ButtonWrapper)`
  width: 128px;
  height: 41px;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.btnIconBg};

  &:disabled {
    background-color: #7d7d7d;
  }
`
const BUTTON_ADD_MORE_WRAPPER = styled(ButtonWrapper)`
  width: 128px;
  height: 41px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.secondary2};
`

const UPLOAD_TEXT = MainText(styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #7d7d7d !important;
  text-align: left;
  line-height: 41px !important;
  height: 41px;
`)

const categoryButton = {
  width: 132,
  height: 41,
  justifyContent: 'space-between'
}

const BottomButtonUpload: FC<{
  type: BottomButtonUploadType
  title: string
  flex?: number
  buttonTitle?: string
  onClick?: (value?: any) => void
}> = ({ title, type, flex, buttonTitle, onClick }) => {
  return (
    <UPLOAD_FIELD_WRAPPER flex={flex}>
      <TITLE>{title}</TITLE>
      {type === BottomButtonUploadType.add_more && (
        <BUTTON_ADD_MORE_WRAPPER onClick={onClick}>
          <span>{buttonTitle}</span>
        </BUTTON_ADD_MORE_WRAPPER>
      )}
      {type === BottomButtonUploadType.plus && (
        <BUTTON_PLUS_WRAPPER onClick={onClick}>
          <span>{buttonTitle}</span>
          <img src={`${process.env.PUBLIC_URL}/img/assets/plus.svg`} alt="Create" />
        </BUTTON_PLUS_WRAPPER>
      )}

      {type === BottomButtonUploadType.category && (
        <DropdowButton className="category" style={categoryButton} title="Choose" handleSelect={onClick} />
      )}

      {type === BottomButtonUploadType.text && <UPLOAD_TEXT>Single item 1/1</UPLOAD_TEXT>}
    </UPLOAD_FIELD_WRAPPER>
  )
}

export default BottomButtonUpload
