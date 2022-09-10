import React from 'react'
import { StyledPopupCompletedProfile } from './PopupCompleteProfile.styled'

interface Props {
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

const PopupCompleteProfile = ({ visible, handleOk, handleCancel }: Props) => (
  <StyledPopupCompletedProfile
    title={null}
    visible={visible}
    onOk={handleOk}
    onCancel={handleCancel}
    footer={null}
  >
    <img className="completed-profile-image" src={`/img/assets/completed-profile.png`} alt="" />
    <div className="title">Get the full experience!</div>
    <div className="desc">Complete your profile and enjoy the full experince of our marketplace.</div>
    <div className="button-group">
      <button className="skip-btn" onClick={handleCancel}>
        Skip
      </button>
      <button className="continue-btn" onClick={handleOk}>
        Continue
      </button>
    </div>
  </StyledPopupCompletedProfile>
)

export default React.memo(PopupCompleteProfile)
