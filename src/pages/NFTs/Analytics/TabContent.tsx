import styled from 'styled-components'
import { Row, Col } from 'antd'
import { useNFTCollections } from '../../../context'

const TAB_CONTENT = styled.div`
  padding: ${({ theme }) => `${theme.margin(4)}`} 32px 0;
  display: flex;
  flex-wrap: wrap;
`
const ANALYTIC_ITEM = styled.div`
  width: 25%;
  padding-right: ${({ theme }) => theme.margin(3)};
  margin-bottom: ${({ theme }) => theme.margin(3)};
  display: flex;

  .analytic-image {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }

  .analytic-content {
    padding-left: ${({ theme }) => theme.margin(3.5)};
    text-align: left;
    overflow: hidden;
  }

  .title {
    margin: 0;
    color: ${({ theme }) => theme.text2};
    font-size: 23px;
    font-weight: 500;
    line-height: 1;
    width: 87%;
    ${({ theme }) => theme.ellipse};
  }
  .check-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    margin-left: ${({ theme }) => theme.margin(1)};
  }

  .value {
    font-size: 20px;
    margin-top: 11px;
    font-weight: 600;
    color: ${({ theme }) => theme.text2};

    img {
      width: 33px;
      height: 33px;
      margin-left: ${({ theme }) => theme.margin(1)};
    }
  }

  .progress {
    display: flex;
    align-items: center;
    margin-top: ${({ theme }) => theme.margin(1)};
    color: ${({ theme }) => theme.text2};

    img {
      width: 22px;
      height: 13px;
      margin-right: ${({ theme }) => theme.margin(1)};
    }
    .percent {
      font-size: 15px;
      font-weight: 500;
    }
  }
`

export const TabContent = () => {
  const { allCollections } = useNFTCollections()
  return (
    <TAB_CONTENT>
      {allCollections.map((item, i) => (
        <ANALYTIC_ITEM key={i}>
          <img
            className="analytic-image"
            // @ts-ignore
            src={item?.profile_pic_link}
            alt=""
          />
          <div className="analytic-content">
            <div style={{ position: 'relative' }}>
              <h2 className="title">
                {/* @ts-ignore */}
                {item?.title}
              </h2>
              <img className="check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
            </div>
            <div className="value">
              1.96 SOL
              <img className="sol-icon" src={`${process.env.PUBLIC_URL}/img/assets/SOL-icon.svg`} alt="" />
            </div>
            <div className="progress">
              <img
                className="progress-icon"
                src={`${process.env.PUBLIC_URL}/img/assets/${i % 2 === 0 ? 'increase' : 'decrease'}-icon.svg`}
                alt=""
              />
              <span className="percent">+ 1.15 %</span>
            </div>
          </div>
        </ANALYTIC_ITEM>
      ))}
    </TAB_CONTENT>
  )
}
