import { Progress } from 'antd'
import styled from 'styled-components'

const PROGRESS_PANEL = styled.div`
  .progress-rate {
    font-size: 12px;
    font-weight: 600;
    text-align: right;
    color: ${({ theme }) => theme.text1};
    margin-top: ${({ theme }) => theme.margin(1)};
    margin-right: ${({ theme }) => theme.margin(9)};
  }
  .ant-progress-outer {
    padding-right: ${({ theme }) => theme.margin(9)};
    margin-right: -${({ theme }) => theme.margin(7)};
  }
  .ant-progress-text {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
  .ant-progress-success-bg,
  .ant-progress-bg {
    height: 45px !important;
    background: #9625ae;
  }
`

export const ProgressPanel = () => (
  <PROGRESS_PANEL>
    <Progress percent={70} status="active" />
    <div className="progress-rate">(5,120/9,111)</div>
  </PROGRESS_PANEL>
)
