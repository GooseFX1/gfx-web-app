import React from 'react'
import styled from 'styled-components'
import 'styled-components/macro'

const WRAPPER = styled.div`
  height: 100vh;
  width: 100vw;
  margin-top: -28vh;
  background: #2a2a2a;
  position: absolute;
  top: 0 !important ;
  padding: 30px 132px 80px 132px;
  .closeIcon {
    position: absolute;
    left: 40px;
    top: 30px;
    cursor: pointer;

    text-align: justify;
  }
  .riskTitle {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    text-align: justify;
    text-align: center;
    margin-bottom: 40px;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .disclaimerText {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    font-size: 14px;
    overflow-y: auto;
  }
`

const DisclaimerPopup = ({ rewardToggle }: { rewardToggle: (b: boolean) => void }) => (
  <WRAPPER>
    <img onClick={() => rewardToggle(false)} className="closeIcon" src="/img/assets/close-white-icon.svg" alt="" />
    <div className="riskTitle">Risks and Discalimers</div>
    <div className="disclaimerText">
      This website is operated by Goose Digital Limited (the “Company”, “we“ or “us”). This website is for
      informational purposes only and therefore, the information and descriptions contained in it are not to be
      construed as an offering memorandum, advertisement or prospectus. Accordingly, this information is not
      intended to be a complete description of all terms, exclusions and conditions applicable to the services
      described in this website. This website and any information or materials contained in it do not constitute
      the distribution, an offer or solicitation of any kind to purchase or sell any product, security or
      instrument whatsoever nor should they be construed as providing any type of investment or other advice or
      recommendations by us, any of our affiliates or third parties to any person in any jurisdiction where such
      distribution, offer, solicitation, purchase or sale would be unlawful under the laws of such jurisdiction.
      Moreover, the Company does not give investment advice, endorsement, analysis or recommendations with respect
      to any cryptocurrencies, digital assets, tokens or securities (“cryptocurrencies”) or provide any financial,
      tax, legal advice or consultancy services of any kind. We are not your broker, intermediary, agent, or
      advisor and has no fiduciary relationship or obligation to you in connection with any trades or other
      decisions or activities effected by you using this website.
      <br />
      <br />
      This website has not been approved by any regulator. This website is for “professional investors”,
      “accredited investors” or “sophisticated investors” only and not for retail use. We encourage you to consult
      your professional advisers in respect of any decisions or activities made on the website.
      <br />
      <br />
      <strong> Disclaimer of Warranties </strong>
      <br />
      <br />
      Information contained in this website is current as at the date of publication, may be superseded by
      subsequent market events or for other reasons, and is subject to change without any notice. Neither the
      Company, its affiliates nor any of its or their officers, directors, agents, employees or representatives
      makes any warranty, express or implied, of any kind whatsoever related to the adequacy, accuracy or
      completeness of any information on this website or the use of information on this website. We do not make any
      investment recommendations, and no communication, through this website or in any other medium, is intended as
      or should be construed as advice or recommendation for any cryptocurrencies offered on or off this website or
      any other sort of advice. In addition, we do not warrant that this website will meet your needs, or that it
      will be uninterrupted, timely, secure or error-free, that defects will be corrected, or that this website or
      the server that makes it available are free of viruses or other harmful components. Accordingly, we and our
      affiliates expressly disclaim any liability, whether in contract, tort, strict liability of otherwise, for
      any direct, indirect, consequential, punitive or special damages arising out of, or in any way connected
      with, any person’s access to or use of this website. This is true even if we or our affiliates have been
      advised of the possibility of such damages or losses. In addition, we will not be liable to any person for
      any loss resulting from a cause over which we do not have control. We may terminate your access to our
      website for any reason, without prior notice.
      <br />
      <br />
      <strong> Risks</strong>
      <br />
      <br />
      Investing in cryptocurrencies is highly risky and may lead to a total loss of investment. You must have
      sufficient understanding of cryptographic tokens, token storage mechanisms (such as token wallets), and
      blockchain technology to appreciate the risks involved in investing in cryptocurrencies. You should conduct
      your own due diligence of any issuer or cryptocurrencies and consult your advisors prior to making any
      investment decision. You are recommended to exercise prudence and trade and invest responsibly within your
      own capabilities. You are solely responsible for determining whether any investment, investment strategy or
      related transaction is appropriate for you according to your personal investment objectives, financial
      circumstances and risk tolerance, and you shall be solely responsible for any loss or liability therefrom.
      You should consult legal or tax professionals regarding your specific situation. We do not recommend that any
      cryptocurrencies should be bought, earned, sold, or held by you and we will not be held responsible for the
      decisions you make based on the information provided by us on this website.
      <br />
      <br />
      AS WITH ANY ASSET, THE VALUES OF CRYPTOCURRENCES ARE VOLATILE AND MAY FLUCTUATE SIGNIFICANTLY AND THERE IS A
      SUBSTANTIAL RISK OF ECONOMIC LOSS WHEN PURCHASING, HOLDING OR INVESTING IN CRYPTOCURRENCIES. BY ACCESSING THE
      WEBSITE AND USING OUR SERVICES, YOU ACKNOWLEDGE AND AGREE THAT: (A) YOU ARE AWARE OF THE RISKS ASSOCIATED
      WITH TRANSACTIONS OF CRYPTOCURRENCIES THAT ARE BASED ON BLOCKCHAIN AND CRYPTOGRAPHY TECHNOLOGIES AND ARE.
    </div>
  </WRAPPER>
)

export default DisclaimerPopup
