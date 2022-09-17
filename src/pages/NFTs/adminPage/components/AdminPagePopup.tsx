import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import { approveProject, rejectProject } from '../../../../api/NFTLaunchpad'
import { useNFTAdmin } from '../../../../context'
import { GradientImageBorder } from './ReviewTable'

const POPUP = styled.div`
  display: flex;
  justify-content: center;
`

const WRAPPER = styled.div`
  height: 40vh;
  min-height: 416px;
  background: #2a2a2a;
  border-radius: 25px;
  width: 768px;
  display: flex;
  font-weight: 600;
  font-size: 22px;
  flex-direction: column;
  align-items: center;
  .close {
    position: relative;
    margin-top: 20px;
    height: 20px;
    margin-left: 680px;
    cursor: pointer;
  }
  .launchpad {
    width: 135px;
    height: 140px;
    margin-top: 10px;
  }
  .reject {
    background: linear-gradient(269.85deg, #cb1b1b 2.14%, #f06565 97.51%) !important ;
  }
  .ant-btn {
    margin-top: 20px;
    background: linear-gradient(90deg, #8ade75 0%, #4b831d 100%);
    width: 30%;
    max-width: 215px;
    height: 42px;
    border-radius: 50px;
    font-size: 15px;
    :hover {
      color: grey;
    }
  }
  .cancle {
    margin-top: 20px;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    color: #eeeeee;
    cursor: pointer;
  }
  .secondaryText {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #b5b5b5;
  }
  .greenCheck {
    margin-top: 8%;
    margin-bottom: 8%;
  }
  .approved {
    font-weight: 600;
    font-size: 35px;
  }
  .approveText {
    width: 550px;
    text-align: center;
    margin-top: 30px;
  }
`
export const ApprovePopup = ({ rewardToggle }: { rewardToggle: (b: boolean) => void }) => {
  const { adminSelected, setUpdate } = useNFTAdmin()
  const [showApproveComplete, setApprove] = useState<boolean>(false)

  const approveClicked = async () => {
    try {
      await approveProject(adminSelected)
      setApprove(true)
      setUpdate((prev) => prev + 1)
    } catch (e) {
      console.log(e)
    }
  }
  if (showApproveComplete) return <ApproveCompletePopup rewardToggle={rewardToggle} />

  return (
    <POPUP>
      <WRAPPER>
        <img
          className="close"
          src="/img/assets/close-white-icon.svg"
          alt="x"
          onClick={() => rewardToggle(false)}
        />
        <img className="launchpad" src="/img/assets/launchpad-logo.svg" alt="launchpad" />
        <div className="approveText">
          You are about to approve “{adminSelected[1]?.projectName}” and it will be added to the calendar
          inmediatly.
        </div>
        <Button onClick={() => approveClicked()}>Approve project</Button>

        <div className="cancle" onClick={() => rewardToggle(false)}>
          Cancle
        </div>
      </WRAPPER>
    </POPUP>
  )
}
export const ApproveCompletePopup = ({ rewardToggle }: { rewardToggle: (b: boolean) => void }) => {
  const { adminSelected } = useNFTAdmin()

  useEffect(() => {
    setTimeout(() => {
      rewardToggle(false)
    }, 3000)
  }, [])

  return (
    <POPUP>
      <WRAPPER>
        <img
          className="close"
          src="/img/assets/close-white-icon.svg"
          alt="x"
          onClick={() => rewardToggle(false)}
        />
        <div className="approved">Sucessfully approved</div>
        <GradientImageBorder height={200} width={200} img={adminSelected[2]?.image} />
        <div className="approved">{adminSelected[1].projectName}</div>
        <div className="secondaryText">{adminSelected[1].collectionName}</div>
      </WRAPPER>
    </POPUP>
  )
}

export const RejectPopup = ({ rewardToggle }: { rewardToggle: (b: boolean) => void }) => {
  const { adminSelected, setUpdate } = useNFTAdmin()
  const [showRejectionComplete, setComplete] = useState<boolean>(false)
  const rejectClicked = async () => {
    try {
      await rejectProject(adminSelected)
      await setComplete(true)
      setUpdate((prev) => prev + 1)
    } catch (e) {
      console.log(e)
    }
  }
  if (showRejectionComplete) return <RejectionCompletePopup rewardToggle={rewardToggle} />
  else
    return (
      <POPUP>
        <WRAPPER>
          <img
            className="close"
            src="/img/assets/close-white-icon.svg"
            alt="x"
            onClick={() => rewardToggle(false)}
          />
          <img className="launchpad" src="/img/assets/launchpad-logo.svg" alt="launchpad" />
          <div className="approveText">
            Are you sure you want to reject “{adminSelected[1]?.projectName}” project?
          </div>
          <Button className="reject" onClick={() => rejectClicked()}>
            Reject project
          </Button>
          <div className="cancle" onClick={() => rewardToggle(false)}>
            Cancle
          </div>
        </WRAPPER>
      </POPUP>
    )
}
export const RejectionCompletePopup = ({ rewardToggle }: { rewardToggle: (b: boolean) => void }) => {
  useEffect(() => {
    setTimeout(() => {
      rewardToggle(false)
    }, 3000)
  }, [])
  return (
    <POPUP>
      <WRAPPER>
        <img
          className="close"
          src="/img/assets/close-white-icon.svg"
          alt="x"
          onClick={() => rewardToggle(false)}
        />
        <div className="approveText">Project successfully rejected</div>
        <img
          className="greenCheck"
          src="/img/assets/nft-admin/greenCheck.svg"
          alt="x"
          onClick={() => rewardToggle(false)}
        />

        <div className="secondaryText">This project can be add it again in the future.</div>
      </WRAPPER>
    </POPUP>
  )
}
