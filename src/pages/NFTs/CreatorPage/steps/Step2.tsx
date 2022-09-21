import { Col, Row, Button, Switch, Input } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ImageContainer, InputSection, NextStepsButton } from '../components/SharedComponents'
import tw from 'twin.macro'
import { FileDrop } from 'react-file-drop'
import { useNFTCreator } from '../../../../context/nft_creator'
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
  .ant-col-12:first-child {
    padding-left: 55px;
    padding-right: 100px;
  }
  .ant-col-12:nth-child(2) {
    padding-right: 60px;
    display: flex;
    justify-content: start;
    flex-direction: column;
    align-items: end;
  }
  .heading {
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 5px;
    margin-top: 40px;
  }
  .margin-30 {
    margin-top: 30px;
  }
  .next-steps {
    ${tw`mt-20 flex items-end justify-end`}
    .ant-btn {
      ${tw`rounded-3xl`}
      background-color: ${({ theme }) => theme.primary3};
    }
  }
  .file-drop {
    border: 1px dotted white;
    height: 150px;
    ${tw`relative text-base`}
    .file-drop-target {
      ${tw`h-full w-full flex flex-col items-center justify-center absolute top-0 left-0`}
      height: 100%;
      width: 100%;
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
  .big-label {
    ${tw`text-2xl font-semibold mb-6`}
  }
  .price-container {
    ${tw`w-full h-52 rounded-[30px] flex flex-col justify-center items-center`}
    background-color: ${({ theme }) => theme.propertyBg2};
    .price-toggle {
      .ant-switch {
        background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
        ${tw`h-11 w-20`}
        .ant-switch-handle {
          ${tw`h-10 w-10`}
        }
        .ant-switch-handle::before {
          border-radius: 22px;
        }
      }
      .ant-switch-checked .ant-switch-handle {
        left: calc(100% - 40px - 2px);
      }
      .currency {
        ${tw`px-6 text-[22px] relative top-1`}
      }
    }
    .mint-price-label {
      ${tw`text-xl mt-5`}
    }
    .mint-input {
      ${tw`w-6/12 mt-5`}
      .ant-input-affix-wrapper {
        border-radius: 50px;
        border: none;
        background: ${({ theme }) => theme.inputBg};
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          margin: 0;
        }
        ${tw`h-12 w-full`}
        .currency-name {
          ${tw`text-[22px] `}
        }
      }
      .ant-input {
        border-radius: 50px;
        border: none;
        background: ${({ theme }) => theme.inputBg};
        ${tw`text-[22px] text-center`}
      }
      .ant-input:hover {
        border: none;
      }
      .ant-input:focus {
        box-shadow: none !important;
      }
    }
    .price-reflected {
      ${tw`text-sm`}
      color: ${({ theme }) => theme.text25}
    }
  }
  .full-width-row {
    ${tw`w-full pl-7`}
    .ant-col:first-child {
      ${tw`flex justify-end items-start flex-col text-[22px]`}
      color: ${({ theme }) => theme.text25};
    }
  }
`

export const Step2: FC = () => {
  const [imageLink, setImageLink] = useState<string>('')
  const inputReference = React.useRef(null)
  const [items, setItems] = useState<string>()
  const [isUSDC, setIsUSDC] = useState<boolean>(false)
  const [mintPrice, setMintPrice] = useState<number>()
  const [nextButtonActive, setNextButtonActive] = useState<boolean>(false)
  const wallet = useWallet()
  const { creatorData, previousStep } = useNFTCreator()
  const fileConstraints = async (file) => {
    const extension = file.name.split('.')[1]
    if (
      (extension === 'png' ||
        extension === 'jpg' ||
        extension === 'jpeg' ||
        extension === 'gif' ||
        extension === 'mp4') &&
      file.size < 20 * 1024 * 1024
    ) {
      notify({
        message: 'Upload Started...'
      })
      uploadFile(file, { ...config, dirName: 'launchpad_' + wallet.publicKey.toBase58() + '_cover' }).then(
        (data: any) => {
          setImageLink(data.location)
          notify({
            message: 'Upload Complete!'
          })
        }
      ) //save image link with setS3Link(dataLink)
    }
  }

  useEffect(() => {
    if (imageLink && items && parseInt(items) > 0 && mintPrice && mintPrice > 0) setNextButtonActive(true)
    else setNextButtonActive(false)
  }, [imageLink, items, mintPrice])

  useEffect(() => {
    if (creatorData && creatorData[2]) {
      setMintPrice(creatorData[2].price)
      setIsUSDC(creatorData[2].currency === 'USDC')
      setImageLink(creatorData[2].image)
      setItems(creatorData[2].items.toString())
    }
  }, [creatorData])

  const creatorStepData: ICreatorData[2] = {
    items: parseInt(items),
    currency: isUSDC ? 'USDC' : 'SOL',
    price: mintPrice,
    image: imageLink
  }

  return (
    <WRAPPER>
      <Row>
        <Col span={12}>
          <Row className="relative-row">
            <img
              onClick={() => previousStep()}
              className="back-button"
              src="/img/assets/backArrowWhite.svg"
              alt="back"
            />
            <div className="big-label">2. Cover image and number of items</div>
          </Row>
          <div>
            <FileDrop onDrop={(files) => fileConstraints(files[0])}>
              {!imageLink ? 'Drag and drop a file to upload or' : ''}
              {!imageLink ? (
                <>
                  <input
                    className="hiddenInput"
                    type={'file'}
                    ref={inputReference}
                    onChange={(e) => fileConstraints(e.target.files[0])}
                  />
                  <Button onClick={() => inputReference.current.click()}>Select File</Button>{' '}
                </>
              ) : (
                <div className="image-uploaded-section">
                  <img
                    className="close-icon"
                    alt="close"
                    src={'/img/assets/close-gray-icon.svg'}
                    onClick={() => {
                      setImageLink('')
                    }}
                  />
                  <img className="uploaded-image" alt="not found" src={imageLink} />
                  {/*<div className="image-info">{uploadedImage?.name}</div>*/}
                </div>
              )}
            </FileDrop>
            <div className="size-label">Max 20 MB (JPEG,PNG,GIF or MP4)</div>
          </div>
          <Row className="margin-30">
            <InputSection
              label="Number of items"
              placeholder="Enter number of items"
              value={items}
              setValue={setItems}
            />
          </Row>
          <Row>
            <div className="big-label margin-30">Do you wish to raise SOL or USDC?</div>
          </Row>
          <Row>
            <div className="price-container">
              <div className="price-toggle">
                <span className="currency">SOL</span>
                <Switch checked={isUSDC} onChange={() => setIsUSDC(!isUSDC)} />
                <span className="currency">USDC</span>
              </div>
              <div className="mint-price-label">Mint price</div>
              <div className="mint-input">
                <Input
                  placeholder="0.00"
                  type={'number'}
                  value={mintPrice}
                  onChange={(e) => setMintPrice(parseFloat(parseFloat(e.target.value).toFixed(2)))}
                  suffix={<span className="currency-name">{isUSDC ? 'USDC' : 'SOL'}</span>}
                />
              </div>
              <div className="price-reflected">Price reflected per item</div>
            </div>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <ImageContainer fileName={imageLink} imageName="no-image" />
          </Row>
          <Row className="full-width-row" justify="space-between">
            <Col span={10}>
              <div>Total amount raised: </div>
              <div>
                {items && mintPrice ? parseFloat(items) * mintPrice : 0} {isUSDC ? 'USDC' : 'SOL'}
              </div>
            </Col>
            <Col span={6}>
              <NextStepsButton data={creatorStepData} active={nextButtonActive} />
            </Col>
          </Row>
        </Col>
      </Row>
    </WRAPPER>
  )
}
