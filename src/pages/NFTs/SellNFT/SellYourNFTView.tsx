import React from 'react'
import styled from 'styled-components'
import { Form } from 'antd'
import { LabelSection } from '../Form/LabelSection'
import { SellCategory } from '../SellCategory/SellCategory'
import { FormDoubleItem } from '../Form/FormDoubleItem'
import { PreviewPicture } from '../PreviewPicture/PreviewPicture'
import { PopupCustom } from '../Popup/PopupCustom'
import { Donate } from '../Form/Donate'
import { GroupButton } from '../GroupButton/GroupButton'
import { dataFormRow1, dataFormRow2, dataDonate, mockDataPicture } from './mockData'

export const StyledSellYourNFTView = styled.div`
  .ant-modal-body {
    padding: ${({ theme }) => theme.margin(8)} ${({ theme }) => theme.margin(9)};
  }
`

const STYLED_FORM = styled(Form)`
  display: flex;
  .mb-3x {
    margin-bottom: ${({ theme }) => theme.margin(3)} !important;
  }
`

const STYLED_LEFT_CONTENT = styled.div`
  width: 60%;
  padding-left: ${({ theme }) => theme.margin(7)};
  padding-right: ${({ theme }) => theme.margin(10)};
`

const STYLED_RIGHT_CONTENT = styled.div`
  width: 40%;
  padding-left: ${({ theme }) => theme.margin(2)};
`

interface Props {
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

export const SellYourNFTView = ({ visible, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()

  return (
    <PopupCustom
      width="1250px"
      height="645px"
      title={null}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <STYLED_FORM form={form} layout="vertical" initialValues={{}}>
        <STYLED_LEFT_CONTENT>
          <LabelSection label="Sell your NFT" className="mb-3x" />
          <SellCategory />
          <LabelSection label="4. Live auction settings" className="mb-3x" />
          <FormDoubleItem data={dataFormRow1} className="mb-3x" />
          <FormDoubleItem data={dataFormRow2} className="mb-3x" />
          <Donate {...dataDonate} />
        </STYLED_LEFT_CONTENT>
        <STYLED_RIGHT_CONTENT>
          <PreviewPicture data={mockDataPicture} />
          <GroupButton text1="Save as a draft" text2="Sell item" />
        </STYLED_RIGHT_CONTENT>
      </STYLED_FORM>
    </PopupCustom>
  )
}
