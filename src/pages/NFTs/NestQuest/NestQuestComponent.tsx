import React from 'react'
import styled from 'styled-components'

const ROADMAP_WRAPPER = styled.div`
  .elipse {
    height: 60px;
    width: 60px;
    margin-left: 0px;
  }
  .verticalLine {
    width: 30%;
    height: 5px;

    margin-left: 20px;
  }
  .verticalContainer {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .main-text {
    width: 50%;
    line-height: 20px;
    float: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .headingText {
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
  }
  .subHeadingText {
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    color: #b5b5b5;
    text-align: right;
    padding-top: 5px;
    margin: 0px;
  }
`
// const GOLDEN_POPUP = styled.div`
//   background: ${({ theme }) => theme.bg2};
//   margin: auto;
//   margin-top: -5%;
//   width: 570px;
//   height: 625px;
//   border-radius: 25px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   align-items: center;
//   .circle {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     padding-top: 70px;
//   }
//   .available {
//     font-weight: 600;
//     font-size: 18px;
//     color: #b5b5b5;
//     line-height: 22px;
//   }
//   .available-text {
//     font-weight: 600;
//     font-size: 28px;
//     line-height: 34px;
//     color: #eeeeee;
//   }
//   .available-text {
//     font-weight: 600;
//     font-size: 28px;
//     line-height: 34px;
//     color: #eeeeee;
//   }
//   .need-more-text {
//     font-weight: 500;
//     font-size: 22px;
//     line-height: 27px;
//     text-align: center;
//   }
// `

const TEAM_MEMBER_WRAPPER = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  .avatar {
    cursor: pointer;
    margin-bottom: 20px;

    margin-top: 15px;
  }
  .userNameText {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    margin-top: 15px;
    margin-bottom: 38px;
  }
`

const VESTING_WRAPPER = styled.div`
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 18%;
  }
  display: flex;
  flex-direction: column;
  .vestingStr {
    margin: auto;
    margin-left: 40px;
    margin-right: 40px;
    text-align: center;
    font-weight: 600;
    font-size: 22px;
    .percentText {
      font-weight: 600;
      font-size: 22px;
      color: #50bb35;
    }
  }
  .currencyImg {
    width: 35px;
    height: 35px;
    margin-right: 15px;
  }
  .raisedText {
    font-weight: 600;
    font-size: 25px;
  }
`

export const Vesting = ({ currency, str }) => {
  return (
    <>
      <VESTING_WRAPPER>
        <div className="wrapper">
          <img className="currencyImg" src={`/img/crypto/${currency}.svg`} />
          <div className="raisedText">{`${currency} raised:`}</div>
        </div>

        <div className="vestingStr">
          <span className="percentText">{`50% `}</span>
          unlocked upfront,
          <span className="percentText">{`25% `}</span>
          after 3 months,
          <span className="percentText">{`25% `}</span>
          after 6 months.
        </div>
      </VESTING_WRAPPER>
    </>
  )
}

// export const GoldenTicketPopup = ({}) => {
//   const closeGoldenPopup = (e) => {
//     if (e.target.id !== 'golden-ticket-popup') console.log('close popup')
//   }
//   return (
//     <GOLDEN_POPUP id="golden-ticket-popup" onClick={(e) => closeGoldenPopup(e)}>
//       <div className="circle">
//         <img className="ticket" src="/img/assets/GoldenTicket.png" />
//       </div>
//       <div className="available-text">Available:</div>
//       <div className="available-text">3 Golden Tickets</div>
//       <div className="need-more-text">
//         {'You need 1 '}
//         <span className="golden-text">{' Golden Ticket '}</span>
//         to get on the Okay Bears Whitelist.
//       </div>
//     </GOLDEN_POPUP>
//   )
// }

export const TeamMembers = ({ teamMembers }) => {
  return (
    <TEAM_MEMBER_WRAPPER>
      {teamMembers?.map((team) => {
        return (
          <div>
            {team?.dp_url ? (
              <div className="avatar">
                <img src={team?.dp_url} alt="" />
              </div>
            ) : (
              <div className="avatar">
                <img src={`/img/assets/avatar.svg`} alt="" />
              </div>
            )}
            <div className="userNameText">{team?.name}</div>
          </div>
        )
      })}
    </TEAM_MEMBER_WRAPPER>
  )
}

export const RoadMap = ({ roadmap }) => {
  return (
    <ROADMAP_WRAPPER>
      {roadmap?.map((road) => {
        return (
          <div className="verticalContainer">
            <img className="elipse" src="/img/assets/elipse.svg" alt="" />
            <img className="verticalLine" src="/img/assets/vectorLine.svg" alt="" />
            <div className="main-text">
              <div className="headingText">{road?.heading}</div>
              <div className="subHeadingText">{road?.subheading + ' ' + road?.subheading}</div>
            </div>
          </div>
        )
      })}
    </ROADMAP_WRAPPER>
  )
}
