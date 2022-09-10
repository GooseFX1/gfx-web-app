import { Col, DatePicker, Row, Switch } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useNFTCreator } from '../../../../context/nft_creator'
import { ImageContainer, NextStepsButton } from '../components/SharedComponents'
import 'styled-components/macro'
import moment from 'moment'
import { ICreatorData } from '../../../../types/nft_launchpad'

const MINIMUM_DATE = moment().add(7, 'd')
const MAXIMUM_DATE = moment().add(31, 'd')
const TIME_OPTIONS = ['10:00 am', '11:00 am', '2:00 pm', '5:00pm', '6:00pm']

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
  }
  .ant-col-12:nth-child(2) {
    padding-right: 60px;
    display: flex;
    justify-content: start;
    flex-direction: column;
    align-items: end;
  }
  .vesting-container {
    ${tw`w-full py-10 rounded-[30px] flex flex-col justify-center items-center mb-10`}
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
    .vesting-options-banner {
      ${tw`w-11/12 h-12 rounded-[44px] mt-5 text-base flex items-center justify-center cursor-pointer`}
      background-color: ${({ theme }) => theme.inputBg};
      &.active {
        background-color: ${({ theme }) => theme.primary2};
      }
    }
  }
  .next-day-label {
    color: ${({ theme }) => theme.text25};
    ${tw`-mt-4`}
  }
  .dateBanner {
    background-color: ${({ theme }) => theme.propertyBg2};
    ${tw`flex justify-center items-center h-12 text-lg font-semibold w-4/12 rounded-[66px] cursor-pointer relative`}
    &.active {
      background-color: ${({ theme }) => theme.primary2};
    }
    .ant-picker {
      ${tw`h-full w-full opacity-0 absolute cursor-pointer`}
    }
  }
  .circle-time {
    background-color: ${({ theme }) => theme.propertyBg2};
    ${tw`flex justify-center items-center h-20 text-sm font-semibold w-20 rounded-full cursor-pointer relative`}
    &.active {
      background-color: ${({ theme }) => theme.primary2};
    }
  }
`

export const Step3: FC = () => {
  const { previousStep, creatorData } = useNFTCreator()

  const [isVesting, setIsVesting] = useState<boolean>(false)
  const [vestingOptionIndex, setVestingOptionIndex] = useState<number>(0)
  const [dateOptionIndex, setDateOptionIndex] = useState<number>(-1)
  const [timeIndex, setTimeIndex] = useState<number>(-1)
  const [selectedDate, setSelectedDate] = useState<any>(MINIMUM_DATE)
  const [nextButtonActive, setNextButtonActive] = useState<boolean>(false)

  const dateFrom = MINIMUM_DATE.format('DD-MM-YYYY')

  const handleDateOk = (e) => {
    if (MINIMUM_DATE.isBefore(e)) setSelectedDate(e)
  }

  useEffect(() => {
    if (dateOptionIndex !== -1 && timeIndex !== -1) setNextButtonActive(true)
    else setNextButtonActive(false)
  }, [dateOptionIndex, timeIndex])

  useEffect(() => {
    if (creatorData && creatorData[3]) {
      setIsVesting(!!creatorData[3].vesting)
      setSelectedDate(moment(creatorData[3].date, 'DD-MM-YYYY'))
      creatorData[3].date === dateFrom ? setDateOptionIndex(0) : setDateOptionIndex(1)
      TIME_OPTIONS.map((item, index) => {
        if (item === creatorData[3].time) setTimeIndex(index)
      })
    }
  }, [creatorData])

  const creatorStepData: ICreatorData[3] = {
    vesting: !isVesting ? false : vestingOptionIndex === 0 ? [50, 25, 25] : [40, 30, 30],
    date: dateOptionIndex === 0 ? MINIMUM_DATE.format('DD-MM-YYYY') : selectedDate.format('DD-MM-YYYY'),
    time: timeIndex > -1 ? TIME_OPTIONS[timeIndex] : ''
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
            <div className="big-label">3. Do you want to vest your funds?</div>
          </Row>
          <Row>
            <div className="vesting-container">
              <div className="price-toggle">
                <span className="vesting-options">No</span>
                <Switch checked={isVesting} onChange={() => setIsVesting(!isVesting)} />
                <span className="vesting-options">Yes</span>
              </div>
              <div className="vesting-label">Vesting options</div>
              {isVesting ? (
                <>
                  <div
                    onClick={() => setVestingOptionIndex(0)}
                    className={'vesting-options-banner ' + (vestingOptionIndex === 0 ? 'active' : '')}
                  >
                    50% upfront, 25% after 3 months, 25% after 6 months{' '}
                  </div>
                  <div
                    onClick={() => setVestingOptionIndex(1)}
                    className={'vesting-options-banner ' + (vestingOptionIndex === 1 ? 'active' : '')}
                  >
                    40% upfront, 30% after 3 months, 30% after 6 months{' '}
                  </div>{' '}
                </>
              ) : null}
            </div>
          </Row>
          <Row>
            <div className="big-label">When will your project will be ready to mint?</div>
          </Row>
          <Row>
            <div className="next-day-label">Next available day</div>
          </Row>
          <Row tw="flex justify-between items-center mt-5">
            <div
              className={'dateBanner ' + (dateOptionIndex === 0 ? 'active' : '')}
              onClick={() => setDateOptionIndex(0)}
            >
              {dateFrom.toString()}
            </div>
            <div>Or</div>
            <div
              className={'dateBanner ' + (dateOptionIndex === 1 ? 'active' : '')}
              onClick={() => {
                setDateOptionIndex(1)
              }}
            >
              {dateOptionIndex === 1 ? selectedDate.format('DD-MM-YYYY') : 'Pick your day'}
              <DatePicker
                disabledDate={(date) => date.isBefore(MINIMUM_DATE) || date.isAfter(MAXIMUM_DATE)}
                value={selectedDate}
                onChange={handleDateOk}
                showToday={false}
                format={'DD-MM-YYYY'}
              />
            </div>
          </Row>
          <Row tw="mt-10">
            <div className="next-day-label">Pick a time based on availability</div>
          </Row>
          <Row tw="flex justify-between items-center w-full mt-5">
            {TIME_OPTIONS.map((item, index) => (
              <div
                key={index}
                className={'circle-time ' + (timeIndex === index ? 'active' : '')}
                onClick={() => setTimeIndex(index)}
              >
                {item}
              </div>
            ))}
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <ImageContainer fileName={creatorData[2] && creatorData[2].image} imageName="no-image" />
          </Row>
          <NextStepsButton data={creatorStepData} active={nextButtonActive} />
        </Col>
      </Row>
    </WRAPPER>
  )
}
