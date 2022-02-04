import { FC } from 'react'
import styled, { css } from 'styled-components'
import { Row, Col, Image } from 'antd'

const ownersData = [...Array(100).keys()]

const OWNERS_TAB = styled(Row)`
  ${({ theme }) => css`
    padding: ${theme.margin(5.5)} ${theme.margin(4)};

    .owners-tab-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    .owners-tab-name {
      color: ${theme.text8};
      margin-top: ${theme.margin(1.5)};
      font-family: Montserrat;
    }
  `}
`

const OWNERS_ITEM = styled(Col)``

export const OwnersTabContent: FC = ({ ...rest }) => {
  return (
    <OWNERS_TAB gutter={[40, 40]} {...rest}>
      {ownersData.map((item) => (
        <OWNERS_ITEM span={3} key={item}>
          <Image
            className="owners-tab-avatar"
            preview={false}
            src={`/img/assets/avatar@3x.png`}
            fallback={`/img/assets/avatar@3x.png`}
            alt=""
          />
          <div className="owners-tab-name">Owner Name</div>
        </OWNERS_ITEM>
      ))}
    </OWNERS_TAB>
  )
}
