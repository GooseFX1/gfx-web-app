import { Row } from 'antd'
import { FC } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { RightSection } from './RightSection'
import { LeftSection } from './LeftSection'
import { NFTDEtailsProviderMode } from '../../../types/nft_details'

const NFT_DETAILS = styled.div`
  ${({ theme }) => `
position: relative;
height: 71vh;
padding: ${theme.margins['9x']} ${theme.margins['11x']} ${theme.margins['3x']} ${theme.margins['11x']};
margin: 0 auto;
background-color: ${theme.bg3};
overflow-y: auto;
${theme.flexCenter};
overflow-y: auto;

.nd-content-wrapper {
  width: 100%;
  height: 100%;
  max-width: 1052px;
  margin: 0 auto;
}

.nd-back-icon {
  position: absolute;
  top: 40px;
  left: 30px;
  transform: rotate(90deg);
  width: 25px;
  filter: invert(96%) sepia(96%) saturate(15%) hue-rotate(223deg) brightness(103%) contrast(106%);
  cursor: pointer;
}

.nd-content {
  height: 100%;
}

.nd-preview {
  width: 100%;
  max-width: 456px;
}

.nd-details {
  width: 100%;
  max-width: 430px;
}
`}
`

export const NFTDetails: FC<{ mode: NFTDEtailsProviderMode; handleClickPrimaryButton: () => void }> = ({
  mode,
  handleClickPrimaryButton,
  ...rest
}) => {
  const history = useHistory()

  return (
    <NFT_DETAILS {...rest}>
      <img
        className="nd-back-icon"
        src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
        alt="back"
        onClick={() => history.goBack()}
      />
      <div className="nd-content-wrapper">
        <Row className="nd-content" justify="space-between">
          <div className="nd-preview">
            <LeftSection mode={mode} />
          </div>
          <div className="nd-details">
            <RightSection mode={mode} handleClickPrimaryButton={handleClickPrimaryButton} />
          </div>
        </Row>
      </div>
    </NFT_DETAILS>
  )
}
