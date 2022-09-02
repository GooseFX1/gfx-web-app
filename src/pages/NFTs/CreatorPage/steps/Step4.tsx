import { Col, Row, Switch, Button } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useNFTCreator } from '../../../../context/nft_creator'
import { FileDrop } from 'react-file-drop'
import { ImageContainer, NextStepsButton } from '../components/SharedComponents'
import 'styled-components/macro'
import { ICreatorData } from '../../../../types/nft_launchpad'
import { uploadFile } from 'react-s3'
import { useWallet } from '@solana/wallet-adapter-react'
import { notify } from '../../../../utils'

const config = {
  bucketName: 'gfx-nest-image-resources',
  region: 'ap-south-1',
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY
}

const WRAPPER = styled.div`
  ${tw`mb-12`}
  .relative-row {
    ${tw`relative`}
    .back-button {
      ${tw`absolute -left-8 bottom-6 cursor-pointer`}
    }
  }
  .big-label {
    ${tw`text-2xl font-semibold mb-6 w-full`}
  }
  .ant-col-13 {
    padding-left: 55px;
    padding-right: 50px;
  }
  .ant-col-11 {
    padding-right: 60px;
    display: flex;
    justify-content: start;
    flex-direction: column;
    align-items: end;
  }
  .vesting-container {
    ${tw`w-9/12 py-10 rounded-[30px] flex flex-col justify-center items-center mb-10`}
    background-color: ${({ theme }) => theme.propertyBg2};
    .price-toggle {
      .ant-switch {
        ${tw`h-11 w-20`}
        .ant-switch-handle {
          ${tw`h-10 w-10`}
        }
        .ant-switch-handle::before {
          border-radius: 22px;
        }
      }
      .ant-switch-checked {
        background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      }
      .ant-switch-checked .ant-switch-handle {
        left: calc(100% - 40px - 2px);
      }
      .vesting-options {
        ${tw`px-6 text-[22px] relative top-1`}
      }
    }
    .vesting-label {
      ${tw`text-xl mt-5`}
    }
  }
  .next-day-label {
    color: ${({ theme }) => theme.text25};
    ${tw`-mt-4`}
  }
  .file-drop {
    border: 1px dotted white;
    height: 150px;
    ${tw`relative text-base w-full mt-5`}
    .file-drop-target {
      ${tw`h-full w-full flex flex-col items-center justify-center absolute top-0 left-0`}
      height: 100%;
    }
    .file-drop-target.file-drop-dragging-over-frame {
      border: none;
      background-color: white;
      box-shadow: none;
      z-index: 50;
      opacity: 1;

      /* typography */
      color: black;
    }
    .hiddenInput {
      ${tw`hidden`}
    }
    .ant-btn {
      background-color: ${({ theme }) => theme.primary3};
      color: #eeeeee;
      ${tw`h-11 rounded-[29px] px-10 mt-5`}
    }
    .image-uploaded-section {
      ${tw`relative flex justify-center items-center h-full py-2 w-full`}
      .close-icon {
        ${tw`absolute top-1 right-3 cursor-pointer`}
      }
      .uploaded-image {
        ${tw`h-full`}
      }
      .image-info {
        ${tw`ml-4`}
      }
    }
  }
  .size-label {
    ${tw`text-center text-sm`}
    color: ${({ theme }) => theme.text1h}
  }
`
export const Step4: FC = () => {
  const { previousStep, creatorData } = useNFTCreator()
  const [imageLink, setImageLink] = useState('')
  const inputReference = React.useRef(null)
  const wallet = useWallet()
  const [isDelayedReveal, setIsDelayedReveal] = useState<boolean>(false)
  const [nextButtonActive, setNextButtonActive] = useState<boolean>(false)

  const fileConstraints = (file) => {
    const extension = file.name.split('.')[1]
    if ((extension === '7z' || extension === 'rar' || extension === 'zip') && file.size < 200 * 1024 * 1024) {
      notify({
        message: 'Please wait for the upload to finish it may take a while...'
      })
      uploadFile(file, { ...config, dirName: 'launchpad_' + wallet.publicKey.toBase58() + '_assets' }).then(
        (data: any) => {
          setImageLink(data.location)
          notify({
            message: 'Upload Complete!'
          })
        }
      )
    }
  }

  const creatorStepData: ICreatorData[4] = {
    delayedReveal: isDelayedReveal,
    uploadedFiles: imageLink
  }

  useEffect(() => {
    if (creatorData && creatorData[4]) {
      setIsDelayedReveal(creatorData[4].delayedReveal)
      setImageLink(creatorData[4].uploadedFiles)
    }
  }, [creatorData])

  useEffect(() => {
    if (imageLink) setNextButtonActive(true)
    else setNextButtonActive(false)
  }, [imageLink])

  return (
    <WRAPPER>
      <Row>
        <Col span={13}>
          <Row className="relative-row">
            <img
              onClick={() => previousStep()}
              className="back-button"
              src="/img/assets/backArrowWhite.svg"
              alt="back"
            />
            <div className="big-label">4. Do you plan a deleyed reveal for the collection?</div>
          </Row>
          <Row>
            <div className="vesting-container">
              <div className="price-toggle">
                <span className="vesting-options">No</span>
                <Switch checked={isDelayedReveal} onChange={() => setIsDelayedReveal(!isDelayedReveal)} />
                <span className="vesting-options">Yes</span>
              </div>
              <div className="vesting-label"> Pre-reveal place holder</div>
            </div>
          </Row>
          <Row>
            <div className="big-label">Upload all NFT's in your collection</div>
          </Row>
          <div className="next-day-label">Create a zip flie with all NFT's, we will take care of the rest!</div>
          <div tw="w-9/12">
            <FileDrop onDrop={(files) => fileConstraints(files[0])}>
              {!imageLink ? 'Drag and drop a file to upload or' : ''}
              {!imageLink ? (
                <>
                  <input
                    className="hiddenInput"
                    type={'file'}
                    ref={inputReference}
                    onChange={(e) => {
                      notify({
                        message: 'Uploading...'
                      })
                      fileConstraints(e.target.files[0])
                    }}
                  />
                  <Button onClick={() => inputReference.current.click()}>Select File</Button>{' '}
                </>
              ) : (
                <div className="image-uploaded-section">
                  <img
                    className="close-icon"
                    alt="close"
                    src={'/img/assets/close-gray-icon.svg'}
                    onClick={() => setImageLink('')}
                  />
                  <img className="uploaded-image" alt="not found" src={imageLink} />
                  {/*<div className="image-info">{uploadedFile?.name}</div>*/}
                </div>
              )}
            </FileDrop>
            <div className="size-label">Max 200 MB (ZIP, 7z, RAR)</div>
          </div>
        </Col>
        <Col span={11}>
          <Row>
            <ImageContainer fileName={creatorData[2] && creatorData[2].image} imageName="no-image" />
          </Row>
          <NextStepsButton data={creatorStepData} active={nextButtonActive || true} />
        </Col>
      </Row>
    </WRAPPER>
  )
}
