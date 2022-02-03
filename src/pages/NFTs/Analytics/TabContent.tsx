import styled from 'styled-components'
import { useNFTCollections } from '../../../context'

const TAB_CONTENT = styled.div`
  background: #1e1e1e;
  padding: ${({ theme }) => `${theme.margins['4x']}`} 32px 0;
  display: flex;
  flex-wrap: wrap;
`
const ANALYTIC_ITEM = styled.div`
  width: 25%;
  padding-right: ${({ theme }) => theme.margins['3x']};
  margin-bottom: ${({ theme }) => theme.margins['3x']};
  display: flex;
  .analytic-image {
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }

  .analytic-content {
    padding-left: ${({ theme }) => theme.margins['3.5x']};
    text-align: left;
  }

  .title {
    margin: 0;
    color: #fff;
    font-size: 23px;
    font-weight: 500;
    line-height: 1;
    display: flex;
    img {
      width: 20px;
      height: 20px;
      margin-left: ${({ theme }) => theme.margins['1x']};
    }
  }

  .value {
    font-size: 20px;
    margin-top: 11px;
    font-weight: 600;
    img {
      width: 33px;
      height: 33px;
      margin-left: ${({ theme }) => theme.margins['1x']};
    }
  }

  .progress {
    display: flex;
    align-items: center;
    margin-top: ${({ theme }) => theme.margins['1x']};
    img {
      width: 22px;
      height: 13px;
      margin-right: ${({ theme }) => theme.margins['1x']};
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
            <h2 className="title">
              {/* @ts-ignore */}
              {item?.title}
              <img className="check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
            </h2>
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
