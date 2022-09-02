import { Col, Row, Button, Input } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useNFTCreator } from '../../../../context/nft_creator'
import { ReviewButton } from '../components/SharedComponents'
import { ICreatorData } from '../../../../types/nft_launchpad'
import { MileStoneModal } from '../components/MileStoneModal'
import { MileStoneBox } from '../components/MileStoneBox'
import TeamMembersContainer from '../components/TeamMembersContainer'
import { ModalSlide } from '../../../../components/ModalSlide'
import { MODAL_TYPES } from '../../../../constants'

const DISCORD_PREFIX = 'https://discord.gg/'

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
  .ant-col-12:first-child {
    padding-left: 55px;
    padding-right: 100px;
    .ant-row {
      ${tw`w-full`}
    }
  }
  .ant-col-12:nth-child(2) {
    padding-right: 60px;
    display: flex;
    justify-content: start;
    flex-direction: column;
    align-items: end;
  }
  .background-card {
    background-color: ${({ theme }) => theme.bg9};
    ${tw`w-11/12 mb-10 rounded-[20px] mt-3 flex`}
    .milestone-button {
      background-color: ${({ theme }) => theme.primary2};
      ${tw`h-14 px-6 text-lg`}
    }
    .textLabel {
      color: ${({ theme }) => theme.text24};
    }
    .textInput {
      ${tw`w-10/12 mt-3 mb-5`}
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
        ${tw`text-[15px] text-center h-10`}
      }
      .ant-input:hover {
        border: none;
      }
      .ant-input:focus {
        box-shadow: none !important;
      }
    }
  }
  .small-grey {
    color: ${({ theme }) => theme.text25};
    ${tw` text-center`}
  }
  .mileStone-display {
    ${tw`relative`}
  }
  .edit-milestone {
    ${tw`absolute bottom-0 text-center h-20 flex justify-end items-center w-full px-6`}
  }
  .bottomLayer {
    z-index: 1;
    background-color: ${({ theme }) => theme.bg9};
    filter: blur(10px);
  }
  .topLayer {
    z-index: 2;
    .ant-btn {
      ${tw`rounded-[29px] font-semibold text-lg h-12 px-5`}
      background-color: ${({ theme }) => theme.primary2};
    }
  }
`

export const Step5: FC = () => {
  const { previousStep, creatorData } = useNFTCreator()
  const [nextButtonActive, setNextButtonActive] = useState<boolean>(false)
  const [discordValue, setDiscordValue] = useState<string>(DISCORD_PREFIX)
  const [websiteValue, setWebsiteValue] = useState<string>('')
  const [twitter, setTwitter] = useState<string>('')
  const [mileStones, setMileStones] = useState([])
  const [mileStonePopup, setMileStonePopup] = useState<boolean>(false)
  const [teamMembers, setTeamMembers] = useState([])
  const [submitPopup, setSubmitPopup] = useState<boolean>(false)

  const creatorStepData: ICreatorData[5] = {
    discord: discordValue,
    twitter: twitter,
    website: websiteValue,
    roadmap: mileStones.map((item) => {
      const obj = {
        heading: item.input1 + ' ' + item.input2,
        subHeading: item.input3 + ''
      }
      return obj
    }),
    team: teamMembers
  }
  useEffect(() => {
    if (discordValue.length > 22 && twitter !== '' && mileStones.length !== 0) setNextButtonActive(true)
    else setNextButtonActive(false)
  }, [discordValue, twitter, mileStones])

  useEffect(() => {
    if (creatorData && creatorData[5]) {
      setDiscordValue(creatorData[5].discord)
      setTwitter(creatorData[5].twitter)
      setWebsiteValue(creatorData[5].website)
      const roadmapObj = creatorData[5].roadmap.map((item) => {
        const obj = {
          input1: item.heading.split(' ')[0],
          input2: item.heading.split(' ')[1] || '',
          input3: item.subHeading
        }
        return obj
      })
      setMileStones(roadmapObj)
      setTeamMembers(creatorData[5].team)
    }
  }, [creatorData])

  return (
    <WRAPPER>
      {submitPopup && <ModalSlide rewardToggle={setSubmitPopup} modalType={MODAL_TYPES.SUBMIT} />}
      <Row>
        <Col span={12}>
          <Row className="relative-row">
            <img
              onClick={() => previousStep()}
              className="back-button"
              src="/img/assets/backArrowWhite.svg"
              alt="back"
            />
            <div className="big-label">5. Last step, let's connect to socials</div>
          </Row>
          <Row>
            <div className="background-card" tw="h-[240px] justify-center items-center">
              <div tw="w-7/12 pl-4">
                <div tw="text-xl font-semibold" className="textLabel">
                  Discord invite code
                </div>
                <div className="textInput">
                  <Input
                    value={discordValue}
                    onChange={(e) => {
                      const typedText = e.target.value
                      if (typedText.includes(DISCORD_PREFIX)) setDiscordValue(typedText)
                      else setDiscordValue(DISCORD_PREFIX)
                    }}
                  />
                </div>
                <div tw="text-xl font-semibold" className="textLabel">
                  Website URL (optional)
                </div>
                <div className="textInput">
                  <Input value={websiteValue} onChange={(e) => setWebsiteValue(e.target.value)} />
                </div>
              </div>
              <div tw="w-5/12 flex justify-center items-center flex-col">
                <div tw="text-xl font-semibold" className="textLabel">
                  Twitter
                </div>
                <div className="textInput">
                  <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                </div>
                <div className="small-grey" tw="text-xs">
                  In order to launch your collection, your twitter account must have at least 100 followers.
                </div>
              </div>
            </div>
          </Row>
          <Row className="relative-row">
            <div className="big-label">Let's add your Roadmap</div>
          </Row>
          <Row>
            {mileStonePopup && (
              <MileStoneModal
                mileStones={mileStones}
                setMileStones={setMileStones}
                visible={mileStonePopup}
                setVisible={setMileStonePopup}
              />
            )}
            {mileStones.length === 0 ? (
              <div className="background-card" tw={'flex-col flex justify-center items-center h-[170px]'}>
                <div tw="text-lg mb-2">
                  <Button tw="rounded-[30px]" className="milestone-button" onClick={() => setMileStonePopup(true)}>
                    Add milestones
                  </Button>
                </div>
                <div className="small-grey" tw="w-8/12 text-sm">
                  Adding a roadmap gives a better vision, purpose, and where your project is heading.
                </div>
              </div>
            ) : (
              <div
                className="background-card mileStone-display"
                tw={'flex-col flex justify-center items-center h-[250px]'}
              >
                <MileStoneBox roadmap={mileStones} />
                <div className="edit-milestone bottomLayer"></div>
                <div className="edit-milestone topLayer" onClick={() => setMileStonePopup(true)}>
                  <Button>Edit milestones</Button>
                </div>
              </div>
            )}
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <TeamMembersContainer data={creatorStepData} setTeamMembers={setTeamMembers} />
          </Row>
          <ReviewButton data={creatorStepData} setSubmitPopup={setSubmitPopup} active={nextButtonActive} />
        </Col>
      </Row>
    </WRAPPER>
  )
}
