import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Form } from 'antd'
import { MainText } from '../../../styles'
import PreviewImage from './PreviewImage'
import { useHistory } from 'react-router-dom'
import { SellCategory } from '../SellCategory/SellCategory'
import { FormDoubleItem } from '../Form/FormDoubleItem'
import { dataFormRow2, dataFormFixedRow2, dataDonate, startingDays, expirationDays } from './mockData'
import { Donate } from '../Form/Donate'
import { GroupButton } from '../GroupButton/GroupButton'
import isEmpty from 'lodash/isEmpty'

const UPLOAD_CONTENT = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.margin(5)};
  width: 90%;
  margin: 0 auto;

  .live-auction-back-icon {
    transform: rotate(90deg);
    width: 30px;
    height: 30px;
    filter: ${({ theme }) => theme.filterBackIcon};
    cursor: pointer;
    margin-right: ${({ theme }) => theme.margin(5)};
    margin-left: 0;
    margin-top: ${({ theme }) => theme.margin(1)};
  }
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
  margin-right: ${({ theme }) => theme.margin(6)};
`

const PREVIEW_UPLOAD_CONTAINER = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-left: ${({ theme }) => theme.margin(6)};
  margin-right: ${({ theme }) => theme.margin(3)};
`

const SECTION_TITLE = MainText(styled.span`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text7} !important;
  text-align: left;
  margin-bottom: ${({ theme }) => theme.margin(3)};
`)

const STYLED_FORM = styled(Form)`
  .mb-3x {
    margin-bottom: ${({ theme }) => theme.margin(3)} !important;
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
const STYLED_DESCRIPTION = styled.div`
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  color: #fff;
  padding-bottom: ${({ theme }) => theme.margin(5)} !important;
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
  const [category, setCategory] = useState(0)

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
        <img
          className="live-auction-back-icon"
          src={`/img/assets/arrow.svg`}
          alt="back"
          onClick={() => history.push('/NFTs/create-single')}
        />
        <UPLOAD_FIELD_CONTAINER>
          <UPLOAD_INFO_CONTAINER>
            <SECTION_TITLE>3. Sale type</SECTION_TITLE>
            <SellCategory setCategory={setCategory} category={category} />

            <SECTION_TITLE>
              {category === 0 && '4. Live auction settings'}
              {category === 2 && '4. Fixed price settings'}
            </SECTION_TITLE>
            <STYLED_FORM form={form} layout="vertical" initialValues={{}}>
              {category === 0 && (
                <>
                  <FormDoubleItem startingDays={startingDays} expirationDays={expirationDays} className="mb-3x" />
                  <FormDoubleItem data={dataFormRow2} className="mb-3x" onChange={onChange} />
                </>
              )}
              {category === 1 && (
                <STYLED_DESCRIPTION>
                  Open bids are open to any amount and they will be closed after a scuccessful bid agreement or if the
                  creator decides to remove it.
                </STYLED_DESCRIPTION>
              )}
              {category === 2 && <FormDoubleItem data={dataFormFixedRow2} className="mb-3x" onChange={onChange} />}
              <Donate {...dataDonate} label={`${category === 1 ? '4.' : '5.'} Donate for charity`} />
            </STYLED_FORM>
          </UPLOAD_INFO_CONTAINER>
          <PREVIEW_UPLOAD_CONTAINER>
            <PreviewImage file={settingData?.previewImage} status={settingData?.status} />
            <GroupButton
              text1="Save as a draft"
              text2="Sell item"
              disabled={disabled}
              onClick1={() => history.push('/NFTs/create-single')}
            />
          </PREVIEW_UPLOAD_CONTAINER>
        </UPLOAD_FIELD_CONTAINER>
      </UPLOAD_CONTENT>
    </>
  )
}
