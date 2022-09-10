import { Button, Row } from 'antd'
import React, { useState } from 'react'
import { ICreatorData } from '../../../../types/nft_launchpad'
import styled from 'styled-components'
import tw from 'twin.macro'
import { GradientText } from './UpcomingMints'
import { useNFTAdmin } from '../../../../context'
import { useHistory } from 'react-router-dom'

const NOTHING_REVIEW = styled.div`
  ${tw`font-semibold text-2xl`}
  width: 75vw;
  img {
    margin-top: -25px;
    width: 75vw;
    height: 100%;
    object-fit: cover;
  }
  .welcome {
    ${tw`absolute ml-8`}
  }
  .relax {
    position: absolute;
    text-align: center;
    margin-left: 32vw;
    margin-top: 50vh;
  }
`
const WRAPPER = styled.div`
  ${tw`absolute mt-24 h-3/4 w-3/4`}
  overflow-y: auto;
  min-height: 780px;
  z-index: 10;
  font-family: 'Montserrat';
  font-style: normal;

  .ant-row {
    ${tw`z-10 mt-8`}
    padding-left: 20px;
    transition: 0.5s ease-in;
    border-bottom: 1px solid #2a2a2a !important;
  }
  .table-row {
    border-bottom: 1px solid #2a2a2a !important;
  }
  .ant-btn {
    margin-top: 35px;
    background: linear-gradient(90deg, #8ade75 0%, #4b831d 100%);
    width: 15%;
    max-width: 200px;
    height: 42px;
    border-radius: 50px;
    font-size: 15px;
    :hover {
      color: grey;
    }
  }
  .rejectIcon {
    ${tw`w-10 h-10 rounded-full bg-white cursor-pointer absolute flex items-center justify-center		`}
    margin-top: -20px;
    margin-left: -20px;
    img {
      ${tw`w-5 h-5`}
    }
  }

  .collectionName {
    ${tw`text-2xl font-semibold`}
  }
  .tagLine {
    font-weight: 600;
    font-size: 18px;
    color: #b5b5b5;
  }
  .innerDiv {
    margin-top: 30px;
    margin-left: 20px;
    width: 15%;
  }
  .editBtn {
    position: absolute;
    right: 5%;
  }
  .innerDivTitle {
    ${tw`w-1/4 ml-5 mt-7`}
  }
  .whiteText {
    ${tw`text-lg font-semibold`}
    color: #eeeeee;
  }
  .secondryText {
    ${tw`text-base font-semibold`}
    color: #636363;
  }
  .arrow {
    right: 5%;
    ${tw`absolute mt-8`}
  }
  .expanded {
    ${tw`absolute m-28`}
    width: 100%;
    margin-left: -25px;
  }
  .sub-row {
    display: flex;
    margin-left: 2%;
    margin-top: 2%;
  }
  .expandedRow {
    margin-left: -65px;
    ${tw`mt-7 justify-center items-center w-1/4`}
  }
`

const ReviewTable = ({ reviewProjects, btnClicked }: { reviewProjects: any[]; btnClicked: any }) => {
  if (reviewProjects?.length < 1)
    return (
      <NOTHING_REVIEW>
        <div className="relax">
          Relax, No projects <br /> to review
        </div>
        <img src="/img/assets/nft-admin/adminBg.svg" alt="admin bg" />
      </NOTHING_REVIEW>
    )

  if (reviewProjects?.length > 0)
    return (
      <WRAPPER>
        {reviewProjects.map((project: ICreatorData, index: number) => (
          <RowComponent project={project} key={index} index={index} btnClicked={btnClicked} />
        ))}
      </WRAPPER>
    )
  return (
    <WRAPPER>
      <h1>Loading... </h1>
    </WRAPPER>
  )
}

const RowComponent: React.FC<{ project: ICreatorData; index: number; btnClicked: any }> = ({
  project,
  btnClicked
}) => {
  const [expand, setExpand] = useState<boolean>(false)
  const { setAdminSelected } = useNFTAdmin()
  const history = useHistory()

  const arrowDownClicked = () => {
    setExpand(!expand)
    setAdminSelected(project)
  }

  const vestingString = (vest): string => {
    let str = ''
    vest.map((v) => (str += v + '%,'))
    return str.substring(0, 11)
  }
  const getTeamMembers = (team): string => {
    let ans = ''
    team.map((ob) => (ans += ob.name + ', '))
    return ans.substring(0, ans.length - 2)
  }
  const getSocials = (socials: ICreatorData[5]) => {
    const ans = []
    if (socials.discord)
      ans.push(
        <a className="whiteText" key={1} href={socials.discord} target="_blank" rel="noreferrer">
          {' '}
          <u> Discord</u>
        </a>
      )
    if (socials.twitter)
      ans.push(
        <a className="whiteText" key={2} href={socials.twitter} target="_blank" rel="noreferrer">
          <u> Twitter </u>{' '}
        </a>
      )
    if (socials.website)
      ans.push(
        <a className="whiteText" key={3} href={socials.twitter} target="_blank" rel="noreferrer">
          {' '}
          <u> Web </u>{' '}
        </a>
      )
    return ans
  }
  return (
    <Row className="table-row" style={{ height: expand ? '750px' : '160px' }}>
      <GradientImageBorder img={project[2].image} width={120} height={120} />
      <div className="rejectIcon" onClick={() => btnClicked(project, 'reject')}>
        <img src="/img/assets/nft-admin/closeRed.svg" alt="close" />
      </div>
      <div className="innerDivTitle">
        <div className="collectionName">{project[1].projectName} </div>
        <div className="tagLine">{project[1].collectionName} </div>
      </div>
      <div className="innerDiv">
        <div className="secondryText">Mint price</div>
        <div className="whiteText">{project[2].price + ' ' + project[2].currency} </div>
      </div>
      <div className="innerDiv">
        <div className="secondryText">Request day </div>
        <div className="whiteText">{project[3].date} </div>
      </div>
      <Button onClick={() => btnClicked(project)}>Approve project</Button>
      <img
        onClick={() => arrowDownClicked()}
        style={expand ? { transform: 'rotate(180deg)' } : {}}
        className="arrow"
        src="/img/assets/nft-admin/arrow-down.svg"
        alt="arrow-down"
      />
      {expand && (
        <div className="expanded">
          <div className="sub-row">
            <GradientText text={'Step 1'} fontSize={20} fontWeight={600} />
            <div className="editBtn" onClick={() => history.push(`/NFTs/Creator/${project['walletAddress']}`)}>
              <img src="/img/assets/nft-admin/editBtn.png" alt="edit" />
            </div>
            <div className="expandedRow">
              <div className="secondryText">Legal Permission</div>
              <div className="whiteText">Yes, I'm author</div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">Project name</div>
              <div className="whiteText">{project[1].projectName}</div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">Collection name</div>
              <div className="whiteText">{project[1].collectionName}</div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">Collection description</div>
              <div className="whiteText">{project[1].collectionDescription.substring(0, 30)}</div>
            </div>
          </div>
          <div className="sub-row">
            <GradientText text={'Step 2'} fontSize={20} fontWeight={600} />
            <div className="expandedRow">
              <div className="secondryText">Cover image</div>
              <div className="whiteText">{project[2]?.image?.substring(0, 20)}</div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">Number of items</div>
              <div className="whiteText">{project[2].items}</div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">Raised Token</div>
              <div className="whiteText">{project[2].currency}</div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">Mint Price</div>
              <div className="whiteText">{project[2].price}</div>
            </div>
          </div>
          <div className="sub-row">
            <GradientText text={'Step 3'} fontSize={20} fontWeight={600} />
            <div className="expandedRow">
              <div className="secondryText">Vesting options</div>
              <div className="whiteText">
                {!project[3].vesting ? 'No Vesting options' : vestingString(project[3].vesting)}
              </div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">Mint day</div>
              <div className="whiteText">{project[3].date}</div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">Mint Hour</div>
              <div className="whiteText">{project[3].time + ' UTC'}</div>
            </div>
          </div>
          <div className="sub-row">
            <GradientText text={'Step 4'} fontSize={20} fontWeight={600} />
            <div className="expandedRow">
              <div className="secondryText">Pre-reveal place holder</div>
              <div className="whiteText">{project[4].delayedReveal.toString()}</div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">NFT's zip file</div>
              <div className="whiteText">{project[3].date}</div>
            </div>
          </div>
          <div className="sub-row">
            <GradientText text={'Step 5'} fontSize={20} fontWeight={600} />
            <div className="expandedRow">
              <div className="secondryText">Socials</div>
              <div className="whiteText">{getSocials(project[5])}</div>
            </div>
            <div className="expandedRow">
              <div className="secondryText">Roadmap</div>
              {<div className="whiteText">{project[5].roadmap.length}</div>}
            </div>
            <div className="expandedRow">
              <div className="secondryText">Team members</div>
              <div className="whiteText">{getTeamMembers(project[5].team)}</div>
            </div>
          </div>
        </div>
      )}
    </Row>
  )
}

const GRADIENT_BORDER = styled.span`
  background: linear-gradient(-96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  .innerBg {
    background: #2a2a2a;
    border-radius: 10px;
  }
  img {
    position: absolute;
    border-radius: 10px;
  }
`

export const GradientImageBorder = ({ img, height, width }: { img: string; height: number; width: number }) => (
  <GRADIENT_BORDER style={{ width: width, height: height }}>
    <div className="innerBg" style={{ width: width - 7, height: height - 7 }}></div>
    <img style={{ width: width - 15, height: height - 15 }} src={img} alt="nft cover" />
  </GRADIENT_BORDER>
)

export default ReviewTable
