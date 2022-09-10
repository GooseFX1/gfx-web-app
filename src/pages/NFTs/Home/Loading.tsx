import React from 'react'
import styled from 'styled-components'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

const CONTAINER = styled.div`
  position: absolute;
  min-height: 300px;
  padding: ${({ theme }) => `${theme.margin(12.5)}`} 32px 0;
  display: flex;
  flex-wrap: wrap;
  background-color: ${({ theme }) => `${theme.bg2}`};
  z-index: 10;
`

const ITEM = styled.div`
  display: flex;
  width: 25%;
  padding: ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(3)};

  .analytic-content {
    text-align: left;
    overflow: hidden;
    width: calc(100% - 100px);
  }

  .value {
    display: flex;
    align-items: center;
    font-size: 20px;
    margin-top: 11px;
  }
`

const Loading = () => (
  <CONTAINER>
    {[...Array(8)].map((_, index) => (
      <ITEM key={index}>
        <SkeletonCommon width="100px" height="100px" style={{ marginRight: '30px' }} />

        <div className="analytic-content">
          <div style={{ position: 'relative' }}>
            <SkeletonCommon width="149px" height="28px" />
          </div>
          <div className="value">
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SkeletonCommon width="89px" height="24px" style={{ marginRight: '10px' }} />
                <SkeletonCommon width="33px" height="33px" borderRadius="50%" />
              </div>
            </div>
          </div>
        </div>
      </ITEM>
    ))}
  </CONTAINER>
)

export default Loading
