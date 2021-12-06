import { Progress } from 'antd'
import styled from 'styled-components'

const PROGRESS_PANEL = styled.div`
  .progress-rate {
    font-size: 12px;
    font-weight: 600;
    text-align: right;
    color: ${({ theme }) => theme.text1};
    margin-top: ${({ theme }) => theme.margins['1x']};
    margin-right: ${({ theme }) => theme.margins['9x']};
  }
  .ant-progress-outer {
    padding-right: ${({ theme }) => theme.margins['9x']};
    margin-right: -${({ theme }) => theme.margins['7x']};
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

export const ProgressPanel = () => {
  return (
    <PROGRESS_PANEL>
      <Progress percent={70} status="active" />
      <div className="progress-rate">(5,120/9,111)</div>
    </PROGRESS_PANEL>
  )
}
