import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { fetchCreatorProjects } from '../../../../api/NFTLaunchpad'
import { ModalSlide } from '../../../../components/ModalSlide'
import { MODAL_TYPES } from '../../../../constants'
import { useNavCollapse, useNFTAdmin } from '../../../../context'
import { Connect } from '../../../../layouts/App/Connect'
import { ICreatorData } from '../../../../types/nft_launchpad'
import ReviewTable from './ReviewTable'
import UpcomingMints, { GradientText } from './UpcomingMints'

const WRAPPER = styled.div<{ $navCollapsed: boolean }>`
  ${tw`flex`}
  margin-top: calc(100px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  min-height: 850px;
  height: 90vh;
  .connectWallet {
    position: absolute;
    right: 40px;
    z-index: 10;
    top: 30%;
  }
  .adminHeader {
    position: absolute;
    width: 74vw;
    margin-top: -20px;
    height: 120px;
    padding-left: 2%;
    border-bottom: 2px solid #3c3c3c;
  }
  .welcome {
    ${tw`text-xl mt-5 text-xl	`}
  }
  .noOfProjects {
    ${tw`font-semibold text-4xl text-white ml-2`}
  }
`

const AdminDashboard = () => {
  const { isCollapsed, toggleCollapse } = useNavCollapse()
  const [reviewProjects, setReviewProjects] = useState<ICreatorData[]>()
  const [approvePopup, setApprovePopup] = useState<boolean>(false)
  const [rejectPopup, setRejectPopup] = useState<boolean>(false)
  const { setAdminSelected, update } = useNFTAdmin()

  useEffect(() => {
    // fetch Review projects this is temp
    try {
      toggleCollapse(true)
      ;(async () => {
        const { data } = await fetchCreatorProjects()
        setReviewProjects(data)
      })()
    } catch (e) {
      console.log(e)
    }
  }, [update])

  const btnClicked = (project: ICreatorData, param: string) => {
    if (param) setRejectPopup(true)
    else setApprovePopup(true)
    setAdminSelected(project)
  }

  return (
    <WRAPPER $navCollapsed={isCollapsed}>
      {approvePopup && <ModalSlide modalType={MODAL_TYPES.APPROVE_PROJECT} rewardToggle={setApprovePopup} />}
      {rejectPopup && <ModalSlide modalType={MODAL_TYPES.REJECT_PROJECT} rewardToggle={setRejectPopup} />}

      <div className="adminHeader">
        <div className="connectWallet">
          <Connect />
        </div>
        <div className="welcome">Hi, Welcome</div>
        {reviewProjects?.length > 0 && (
          <>
            <GradientText text={reviewProjects?.length + ''} fontSize={40} fontWeight={700} />
            <span className="noOfProjects">Projects to review</span>
          </>
        )}
      </div>

      <ReviewTable reviewProjects={reviewProjects} btnClicked={btnClicked} />
      <UpcomingMints />
    </WRAPPER>
  )
}

export default AdminDashboard
