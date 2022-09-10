import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'

const ROADMAP_WRAPPER = styled.div`
  ${tw`overflow-y-auto pt-9 pb-20`}
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
  .column-one {
    ${tw`w-3/12`}
    .elipse {
      height: 60px;
      width: 60px;
    }
  }
  .verticalLine {
    ${tw`mx-7`}
    width: 150px;
    height: 5px;
  }
  .verticalContainer {
    ${tw`flex justify-between items-center w-full mb-8`}
  }
  .column-three {
    ${tw`text-center`}
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
      width: 340px;
      padding-top: 5px;
    }
  }
`

export const MileStoneBox: FC<{ roadmap: any }> = ({ roadmap }) => (
  <ROADMAP_WRAPPER>
    {roadmap?.map((road, key) => (
      <div className="verticalContainer" key={key}>
        <div className="column-one">
          <img className="elipse" src="/img/assets/elipse.png" alt="" />
        </div>
        <img className="verticalLine" src="/img/assets/vectorLine.svg" alt="" />
        <div className="column-three">
          <div className="headingText">{road?.input1 + ' ' + road?.input2}</div>
          <div className="subHeadingText">
            {road?.input3}
            {/*{road?.subheading}*/}
          </div>
        </div>
      </div>
    ))}
  </ROADMAP_WRAPPER>
)
