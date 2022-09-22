import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { Row, Col, Image } from 'antd'

import { useNFTCollections } from '../../../context'
import { CollectionOwner } from '../../../types/nft_collections'

const OWNERS_TAB = styled(Row)`
  ${({ theme }) => css`
    padding: ${theme.margin(5.5)} ${theme.margin(4)};

    .owners-tab-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-top: 20%;
    }

    .owners-tab-name {
      color: ${theme.text8};
      margin-top: ${theme.margin(1.0)};
      font-family: Montserrat;
      font-size: 16px;
      font-weight: 600;
      width: calc(100% - 48px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `}
`
const WRAPPER = styled.div`
  height: 100%;
`

const NO_CONTENT = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  color: ${({ theme }) => theme.text8};

  .no-data-image {
    max-width: 160px;
    margin-bottom: 20px;
  }
`

const OWNERS_ITEM = styled(Col)``

export const OwnersTabContent: FC<{ filter?: any; setCollapse?: (x: any) => void }> = ({ ...rest }) => {
  const { collectionOwners } = useNFTCollections()

  return (
    <WRAPPER>
      {collectionOwners.length > 0 ? (
        <OWNERS_TAB {...rest}>
          {collectionOwners.map((item: CollectionOwner | null, index: number) => (
            <OWNERS_ITEM span={3} key={item.uuid || item.id || index}>
              <Image
                className="owners-tab-avatar"
                preview={false}
                src={item.profile_pic_link}
                fallback={`/img/assets/avatar@3x.png`}
                alt=""
              />
              <div className="owners-tab-name">{item.nickname}</div>
            </OWNERS_ITEM>
          ))}
        </OWNERS_TAB>
      ) : (
        <NO_CONTENT>
          <div>
            <img className="no-data-image" src={`/img/assets/collected-no-data.png`} alt="" />
            <p>No Collection Owners Data</p>
          </div>
        </NO_CONTENT>
      )}
    </WRAPPER>
  )
}
