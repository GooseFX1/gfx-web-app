import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Image } from 'antd'
import { MainText } from '../../../styles'
import { notify } from '../../../utils'
import { useDarkMode } from '../../../context'

const UPLOAD_CONTENT = styled.div`
  position: relative;
  padding-top: 50px;

  .collectible-back-icon {
    position: absolute;
    top: 55px;
    left: 55px;
    transform: rotate(90deg);
    width: 36px;
    filter: ${({ theme }) => theme.filterBackIcon};
    cursor: pointer;
  }
`

const TITLE = MainText(styled.div`
  font-size: 30px;
  color: ${({ theme }) => theme.text7} !important;
  text-align: center;
  font-weight: 600;
`)

const DESCRIPTION = MainText(styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.text8} !important;
  text-align: center;
  font-weight: 600;
  line-height: 18px;
  margin-top: ${({ theme }) => theme.margin(4)};
  margin-bottom: ${({ theme }) => theme.margin(4)};
`)

const SMALL_DESCRIPTION = MainText(styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.text8} !important;
  text-align: center;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.margin(6)};
`)

const UPLOAD_FILED = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.uploadImageBackground};
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const UPLOAD_FIELD_CONTAINER = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const UPLOAD_FILED_CONTAINER_LEFT = styled(UPLOAD_FIELD_CONTAINER)`
  margin-right: ${({ theme }) => theme.margin(6)};
`
const UPLOAD_FILED_CONTAINER_RIGHT = styled(UPLOAD_FIELD_CONTAINER)`
  margin-left: ${({ theme }) => theme.margin(6)};
`

const UPLOAD_SECTION = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const COVER = styled(UPLOAD_SECTION)<{ $mode: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text1};
  font-size: 22px;
  font-weight: 600;
  background-color: ${({ $mode }) => ($mode ? 'rgb(0 0 0 / 66%)' : 'rgb(202 202 202 / 71%)')};
  border-radius: 20px;
  z-index: 10;
  cursor: default;
`

const IMAGE_COUNT_DESC = styled(DESCRIPTION)`
  margin-top: ${({ theme }) => theme.margin(2.5)};
  margin-bottom: ${({ theme }) => 0};
  color: #fff !important;
`

const UPLOAD_TEXT = MainText(styled.div`
  font-size: 20px;
  color: ${({ theme }) => theme.text8} !important;
  text-align: center;
  font-weight: 600;
  margin-top: ${({ theme }) => theme.margin(4)};
`)

export const Collectible = (): JSX.Element => {
  const history = useHistory()
  const { connected, publicKey } = useWallet()
  const { mode } = useDarkMode()

  const handleSelectSingleCollectable = async () => {
    if (connected && publicKey) {
      history.push('/NFTs/create-single')
    } else {
      notify({
        message: 'A wallet must be connected to mint an NFT',
        type: 'error'
      })
    }
  }

  return (
    <>
      <UPLOAD_CONTENT>
        <img
          className="collectible-back-icon"
          src={`/img/assets/arrow.svg`}
          alt="back"
          onClick={() => history.goBack()}
        />
        <TITLE>Create a collectible</TITLE>
        <DESCRIPTION>
          Choose “Single” if you want your collectible to be one of a kind or “Multiple”
          <br />
          if you want to sell one collectible multiple times
        </DESCRIPTION>
        {/* <SMALL_DESCRIPTION>Live auctions option is avilable only for single items.</SMALL_DESCRIPTION> */}
        <br />
        <br />
        <br />
        <UPLOAD_SECTION>
          <UPLOAD_FILED_CONTAINER_LEFT>
            <UPLOAD_FILED onClick={handleSelectSingleCollectable}>
              <Image draggable={false} preview={false} src={`/img/assets/single-upload.png`} />
              <IMAGE_COUNT_DESC>1/1</IMAGE_COUNT_DESC>
            </UPLOAD_FILED>
            <UPLOAD_TEXT>Single</UPLOAD_TEXT>
          </UPLOAD_FILED_CONTAINER_LEFT>
          <UPLOAD_FILED_CONTAINER_RIGHT>
            <UPLOAD_FILED>
              <COVER $mode={mode === 'dark'}>Coming soon...</COVER>
              <Image draggable={false} preview={false} src={`/img/assets/multiple-upload.png`} />
              <IMAGE_COUNT_DESC>1/100</IMAGE_COUNT_DESC>
            </UPLOAD_FILED>
            <UPLOAD_TEXT>Multiple</UPLOAD_TEXT>
          </UPLOAD_FILED_CONTAINER_RIGHT>
        </UPLOAD_SECTION>
      </UPLOAD_CONTENT>
    </>
  )
}
