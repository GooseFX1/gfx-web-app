import { Col, Row } from 'antd'
import { FC } from 'react'
import styled from 'styled-components'
import { nFormatter } from '../../../utils'

type StatsItemType = { title: string; total: number; unit: string }

const STATS = styled(Row)`
  padding: ${({ theme }) => `${theme.margins['1.5x']} ${theme.margins['2.5x']}`};
  border-radius: 47px;
  background-color: #131313;
  color: #fff;
`

const STATS_ITEM = styled(Col)`
  align-items: center;
  position: relative;
  color: #fff;

  .stats-item-quantity {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: ${({ theme }) => `-${theme.margins['0.5x']}`};
  }

  .stats-item-title {
    font-size: 9px;
    font-weight: 600;
  }

  &:after {
    content: '';
    top: 50%;
    right: 0;
    position: absolute;
    width: 2px;
    height: 26px;
    background-color: #2a2a2a;
    transform: translateY(-50%);
  }

  &:last-child {
    &:after {
      content: none;
    }
  }
`

export const Stats: FC<{ stats: StatsItemType[] }> = ({ stats, ...rest }: any) => {
  return (
    <STATS justify="center" gutter={26} {...rest}>
      {stats.map((item: StatsItemType) => (
        <STATS_ITEM>
          <div className="stats-item-quantity">{`${nFormatter(item.total)} ${item.unit}`}</div>
          <div className="stats-item-title">{item.title}</div>
        </STATS_ITEM>
      ))}
    </STATS>
  )
}
