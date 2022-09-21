import React, { useRef, useEffect, useState, FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useNFTCreator } from '../../../../context/nft_creator'

const WRAPPER = styled.div`
  height: 600px;
  width: 600px;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 20px;
`
const MEMBER_CONTAINER = styled.div`
  width: 99%;
  height: 99%;
  ${tw`flex flex-col rounded-bigger`}
  background-color: ${({ theme }) => theme.bg2};
  margin: auto;
  margin-top: 3px;
  align-items: center;

  .big-label {
    font-weight: 600;
    font-size: 28px;
    align-items: center;
    text-align: center;
    margin-top: 12%;
  }
  .userImg {
    ${tw`mt-5 mb-5 w-20 h-20`}
  }
  .nextUserImg {
    position: absolute;
    opacity: 0.5;
    transform: scale(0.8);
    right: 25px;
    top: 150px;
    :active {
      position: absolute;
      transform: scale(1);
      right: 125px;
      top: 150px;
      transition: 0ms.5s ease;
    }
  }
  .prevUserImg {
    opacity: 0.5;
    transform: scale(0.8);
    margin-right: 600px;
    margin-top: -100px;
    margin-bottom: 20px;
  }
  .hidePrevImg {
    width: 100px;
    z-index: 10;
    height: 100px;
    background-color: ${({ theme }) => theme.bg2};
    margin-top: -100px;
    margin-right: 700px;
  }
  .hideImg {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: ${({ theme }) => theme.bg2};
    right: -40px;
    top: 140px;
  }

  .secondryText {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.text20};
  }
  .inputField {
    width: 322px;
    height: 55px;
    background: ${({ theme }) => theme.bg1};
    border-radius: 50px;
    border: none;
    margin-bottom: 30px;
  }
  .text {
    font-family: Montserrat;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    color: ${({ theme }) => theme.text14};
    display: flex;
  }
  .inputField .placeholder {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
    color: #636363;
  }

  .inputHeader {
    margin-right: -20px;
    width: 322px;
    font-weight: 600;
    font-size: 20px;
    color: #eeeeee;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`

const STYLED_INPUT = styled.input`
  width: 322px;
  height: 44px;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 60px;
  display: flex;
  border: none;
  font-size: 20px;
  align-items: center;
  justify-content: space-between;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  padding: 0 ${({ theme }) => theme.margin(4)};
  margin: 0 ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(1)};
  .inputValue {
    font-family: Montserrat;
    font-size: 22px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: ${({ theme }) => theme.text15};
  }
  &.active {
    .value {
      color: #fff;
      font-weight: 600;
      font-size: 15px;
    }
  }
`
const NEXT_BTN = styled.button`
  position: absolute;
  right: 90px;
  top: 460px;
  width: 55px;
  height: 55px;
  cursor: pointer;
  border: none;
  background: none;
  :disabled {
    opacity: 0.2;
  }
`

const PREV_BTN = styled.button`
  position: absolute;
  right: 570px;
  top: 460px;
  width: 55px;
  border: none;
  background: none;
  height: 55px;
  cursor: pointer;
  :disabled {
    opacity: 0;
  }
`

export const TeamMembersContainer: FC<{ data?: any; setTeamMembers: (x: any) => void }> = ({ setTeamMembers }) => {
  const { creatorData } = useNFTCreator()
  const twitterURL = 'www.twitter.com/'
  const nameRef = useRef<any>()
  const usernameRef = useRef<any>()
  const [index, setIndex] = useState<number>(0)
  const [currentName, setCurrentName] = useState<string>('')
  const [twitterUsername, setCurrentUsername] = useState<string>()
  const [teamArr, setTeamArr] = useState([])

  useEffect(() => {
    setCurrentName(teamArr[index]?.name ? teamArr[index].name : '')
    setCurrentUsername(teamArr[index]?.username ? teamArr[index]?.username : twitterURL)
  }, [index])

  useEffect(() => {
    if (creatorData && creatorData[5]) {
      setTeamArr([...creatorData[5].team])
      setCurrentName(creatorData[5].team[0]['name'])
      setCurrentUsername(creatorData[5].team[0]['username'])
    }
  }, [])

  useEffect(() => {
    setTeamMembers(teamArr)
  }, [teamArr])

  useEffect(() => {
    if (currentName !== '') {
      const arr = [...teamArr]
      arr[index] = {
        name: currentName,
        username: twitterUsername.length > 16 ? twitterUsername : null,
        dp_url: null // add it later
      }
      setTeamArr([...arr])
    }
  }, [currentName, twitterUsername])

  const updateCurrentName = (e) => {
    setCurrentName(e.target.value)
  }
  const updateCurrentUsername = (e) => {
    setCurrentUsername(e.target.value)
  }
  return (
    <WRAPPER>
      <MEMBER_CONTAINER>
        <span className="big-label"> Add Team members </span>
        <UserImgSlides index={index} />

        <span className="secondryText">{currentName ? currentName : 'Team member name'}</span>
        <span className="secondryText">
          @twitter {twitterUsername ? twitterUsername.split('/')[1] : 'username'}
        </span>
        <span className="inputHeader">Name</span>
        {
          <STYLED_INPUT
            className="inputValue"
            //@ts-ignore
            value={currentName}
            placeholder="Add name"
            ref={nameRef}
            onChange={(e) => updateCurrentName(e)}
          />
        }
        <span className="inputHeader">Twitter username (optional)</span>
        {
          <STYLED_INPUT
            className="inputValue"
            //@ts-ignore
            value={twitterUsername}
            ref={usernameRef}
            onChange={(e) => updateCurrentUsername(e)}
          />
        }
        <NEXT_BTN
          onClick={() => setIndex((prev) => prev + 1)}
          disabled={currentName === undefined || currentName === ''}
        >
          <img src="/img/assets/nextBtn.svg" alt="next" />
        </NEXT_BTN>
        <PREV_BTN onClick={() => setIndex((prev) => prev - 1)} disabled={index === 0}>
          <img src="/img/assets/prevBtn.svg" alt="prev" />
        </PREV_BTN>
      </MEMBER_CONTAINER>
    </WRAPPER>
  )
}

export default TeamMembersContainer

const UserImgSlides = ({ index }: { index: number }) => (
  <>
    <span className="userImg">
      <img src="/img/assets/avatarPlaceHolder.png" alt="avatar" />
    </span>
    <span className="nextUserImg">
      <img src="/img/assets/avatarPlaceHolder.png" alt="avatar" />
    </span>
    <span className="hideImg"></span>
    {index !== 0 ? (
      <>
        <div className="prevUserImg">
          <img src="/img/assets/avatarPlaceHolder.png" alt="avatar" />
        </div>
        <span className="hidePrevImg"></span>
      </>
    ) : (
      <></>
    )}
  </>
)
