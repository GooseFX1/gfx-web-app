import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Form } from 'antd'
import { ArrowClicker } from '../../../components'
import { MainText } from '../../../styles'
import PreviewImage from './PreviewImage'
import { useHistory } from 'react-router-dom'
import { SellCategory } from '../SellCategory/SellCategory'
import { FormDoubleItem } from '../Form/FormDoubleItem'
import { dataFormRow1, dataFormRow2, dataDonate, startingDays, expirationDays } from './mockData'
import { Donate } from '../Form/Donate'
import { GroupButton } from '../GroupButton/GroupButton'
import isEmpty from 'lodash/isEmpty'

const UPLOAD_CONTENT = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.margins['5x']};
  width: 90%;
  margin: 0 auto;
`

const LEFT_ARROW = styled(ArrowClicker)`
  width: 30px;
  transform: rotateZ(90deg);
  margin-right: ${({ theme }) => theme.margins['5x']};
  margin-left: 0;
  margin-top: ${({ theme }) => theme.margins['1x']};
`

const UPLOAD_FIELD_CONTAINER = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`

const UPLOAD_INFO_CONTAINER = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  margin-right: ${({ theme }) => theme.margins['6x']};
`

const PREVIEW_UPLOAD_CONTAINER = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-left: ${({ theme }) => theme.margins['6x']};
  margin-right: ${({ theme }) => theme.margins['3x']};
`

const SECTION_TITLE = MainText(styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
  text-align: left;
  margin-bottom: ${({ theme }) => theme.margins['3x']};
`)

const STYLED_FORM = styled(Form)`
  .mb-3x {
    margin-bottom: ${({ theme }) => theme.margins['3x']} !important;
  }

  .ant-form-item-control-input-content {
    display: flex;
    flex-direction: column;
  }

  .description {
    text-align: left;
    max-width: 174px;
  }
`

export const LiveAuction = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const initSettingData = {
    info: {
      title: '',
      desc: ''
    },
    previewImage: '',
    status: ''
  }
  const initLiveData = {
    minimumBid: '',
    royalties: ''
  }
  const [settingData, setSettingData] = useState<any>({ ...initSettingData })
  const [liveData, setLiveData] = useState<any>({ ...initLiveData })
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const { state = {} } = history.location
    if (!isEmpty(state)) {
      setSettingData(state)
    }
  }, [history.location, history.location.state])

  const onChange = ({ e, id }) => {
    const { value } = e.target
    const temp = { ...liveData }
    temp[id] = value
    setLiveData(temp)
  }

  useEffect(() => {
    if (liveData?.minimumBid && liveData?.royalties) {
      setDisabled(false)
    } else setDisabled(true)
  }, [liveData])

  return (
    <>
      <UPLOAD_CONTENT>
        <LEFT_ARROW onClick={() => history.push('/NFTs/single-upload-your-file')} />
        <UPLOAD_FIELD_CONTAINER>
          <UPLOAD_INFO_CONTAINER>
            <SECTION_TITLE>3. Sale type</SECTION_TITLE>
            <SellCategory />

            <SECTION_TITLE>4. Live auction settings</SECTION_TITLE>
            <STYLED_FORM form={form} layout="vertical" initialValues={{}}>
              <FormDoubleItem startingDays={startingDays} expirationDays={expirationDays} className="mb-3x" />
              <FormDoubleItem data={dataFormRow2} className="mb-3x" onChange={onChange} />
              <Donate {...dataDonate} />
            </STYLED_FORM>
          </UPLOAD_INFO_CONTAINER>
          <PREVIEW_UPLOAD_CONTAINER>
            <PreviewImage file={settingData?.previewImage} status={settingData?.status} info={settingData?.info} />
            <GroupButton
              text1="Save as a draft"
              text2="Sell item"
              disabled={disabled}
              onClick1={() => history.push('/NFTs/single-upload-your-file')}
            />
          </PREVIEW_UPLOAD_CONTAINER>
        </UPLOAD_FIELD_CONTAINER>
      </UPLOAD_CONTENT>
    </>
  )
}
