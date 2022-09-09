import React, { Dispatch, FC, SetStateAction } from 'react'
import styled from 'styled-components'
import { Modal } from '../../components'

const WRAPPER = styled.span`
  color: ${({ theme }) => theme.text1};

  * {
    color: ${({ theme }) => theme.text1};
  }

  a {
    color: ${({ theme }) => theme.text3};
    cursor: pointer;
  }

  h3 {
    text-decoration: underline;
  }
`

export const PrivacyPolicy: FC<{
  setVisible: Dispatch<SetStateAction<boolean>>
  visible: boolean
}> = ({ setVisible, visible }) => (
  <Modal large setVisible={setVisible} title="Privacy Policy" visible={visible}>
    <WRAPPER>
      <br />
      <h3>WE VALUE YOUR PRIVACY</h3>
      We value the privacy of individuals who visit our website at https://www.goosefx.io/ (the “Website”), and any
      of our other applications, or services that link to this Privacy Policy (collectively, the "Services"). This
      Privacy Policy ("Policy") is designed to explain how we collect, use, and share information from users of the
      Services. This Policy is incorporated by reference into our Terms of Use. By agreeing to this Policy through
      your continued use of the Services, you agree to the terms and conditions of this Policy.
      <br />
      <br />
      <h3>WHAT TYPE OF INFORMATION WE COLLECT?</h3>
      We collect any information you provide to us when you use the Services. You may provide us with information
      in various ways on the Services. Personal Information: When you use our Services, you are required to provide
      us with your name and email address. You may be required to verify your identity by submitting a valid
      passport, a valid identification card or a valid driver’s license for using some of our Services or accessing
      certain features on the Website. We may from time to time collect additional personal information from you at
      our discretion. Financial Information: We may collect necessary financial information such as your wallet
      address when you use our Services. Usage information: We may collect information about how you access and use
      our Services, your actions on the Services, including your interactions with others on the Services, comments
      and posts you make in our public discussion forums, and other content you may provide. Technical Data: We may
      collect data such as IP (internet protocol) address, ISP (internet Services provider), the web browser used
      to access the Services, the time the Services was accessed, which web pages were visited, operating system
      and platform, a mobile device-type identifier, and other technology on the devices you use to access our
      Services. We may also access your photo and camera roll or Face ID through our mobile application with your
      permission. Communications: We may receive additional information about you when you contact us directly. For
      example, we will receive your email address, the contents of a message or attachments that you may send to
      us, and other information you choose to provide when you contact us through email.
      <br />
      <br />
      <h3>WE COLLECT COOKIES</h3>
      When you use our Services, we may collect information from you through automated means, such as cookies, web
      beacons, and web server logs. By using the Services, you consent to the placement of cookies, beacons, and
      similar technologies in your browser and on emails in accordance with this Policy. The information collected
      in this manner includes IP address, browser characteristics, device IDs and characteristics, operating system
      version, language preferences, referring URLs, and information about the usage of our Services. We may use
      this information, for example, to ensure that the Services functions properly, to determine how many users
      have visited certain pages or opened messages, or to prevent fraud. We also work with analytics providers
      which use cookies and similar technologies to collect and analyze information about use of the Services and
      report on activities and trends. If you do not want information collected through the use of cookies, there
      is a procedure in most browsers that allows you to automatically decline cookies or be given the choice of
      declining or accepting the transfer to your computer of a particular cookie (or cookies) from a particular
      site. You may also wish to refer to http://www.allaboutcookies.org/manage-cookies/index.html. If, however,
      you do not accept cookies, you may experience some inconvenience in your use of the Services.
      <br />
      <br />
      <h3>HOW DO WE USE THE INFORMATION WE COLLECT?</h3>
      Operating, maintaining, enhancing and providing features of the Services, providing Services and information
      that you request, responding to comments and questions, and otherwise providing support to users.
      Understanding and analyzing the usage trends and preferences of our users, improving the Services, developing
      new products, services, features, and functionality. Contacting you for administrative or informational
      purposes, including by providing customer services or sending communications, including changes to our terms,
      conditions, and policies. For marketing purposes, such as developing and providing promotional and
      advertising materials that may be useful, relevant, valuable or otherwise of interest. Personalizing your
      experience on the Services by presenting tailored content. We may aggregate data collected through the
      Services and may use and disclose it for any purpose. For our business purposes, such as audits, security,
      compliance with applicable laws and regulations, fraud monitoring and prevention. Complying with legal and
      regulatory requirements. Protecting our interests, enforcing our Terms of Use or other legal rights.
      <br />
      <br />
      <h3>WHEN AND WITH WHOM DO WE SHARE THE INFORMATION WE COLLECT?</h3>
      We do not rent, sell or share your information with third parties except as described in this Policy. We may
      share your information with the following: Entities in our group or our affiliates in order to provide you
      with the Services. Our third-party services providers who provide services such as website hosting, data
      analysis, customer services, email delivery, auditing, and other services. Credit bureaus and other third
      parties who provide Know Your Customer and Anti-Money Laundering services. Potential or actual acquirer,
      successor, or assignee as part of any reorganization, merger, sale, joint venture, assignment, transfer or
      other disposition of all or any portion of our business, assets or stock (including in bankruptcy or similar
      proceedings). If required to do so by law or in the good faith belief that such action is appropriate: (a)
      under applicable law, including laws outside your country of residence; (b) to comply with legal process; (c)
      to respond to requests from public and government authorities, including public and government authorities
      outside your country of residence; (d) to enforce our terms and conditions; (e) to protect our operations or
      those of any of our subsidiaries; (f) to protect our rights, privacy, safety or property, and/or that of our
      subsidiaries, you or others; and (g) to allow us to pursue available remedies or limit the damages that we
      may sustain. In addition, we may use third party analytics vendors to evaluate and provide us with
      information about your use of the Services. We do not share your information with these third parties, but
      these analytics services providers may set and access their own cookies, pixel tags and similar technologies
      on the services and they may otherwise collect or have access to information about you which they may collect
      over time and across different websites. For example, we use Google Analytics to collect and process certain
      analytics data. Google provides some additional privacy options described at
      https://www.google.com/policies/privacy/partners. We may use and disclose aggregate information that does not
      identify or otherwise relate to an individual for any purpose, unless we are prohibited from doing so under
      applicable law.
      <br />
      <br />
      <h3>THIRD-PARTY SERVICES</h3>
      We may display third-party content on the Services. Third-party content may use cookies, web beacons, or
      other mechanisms for obtaining data in connection with your viewing of and/or interacting with the
      third-party content on the Services. You should be aware that there is always some risk involved in
      transmitting information over the internet. While we strive to protect your Personal Information, we cannot
      ensure or warrant the security and privacy of your Personal Information or other content you transmit using
      the Services, and you do so at your own risk. Please note that we cannot control, nor will we be responsible
      for the Personal Information collected and processed by third parties, its safekeeping or a breach thereof,
      or any other act or omission pertaining to it and their compliance with applicable privacy laws or
      regulations. We advise you to read the respective privacy policy of any such third party and use your best
      discretion.
      <br />
      <br />
      <h3>HOW WE PROTECT YOUR PERSONAL INFORMATION</h3>
      You acknowledge that no data transmission over the internet is totally secure. Accordingly, we cannot warrant
      the security of any information which you transmit to us. That said, we do use certain physical,
      organizational, and technical safeguards that are designed to maintain the integrity and security of
      information that we collect. For instance, we have implemented administrative, technical, and physical
      safeguards to help prevent unauthorized access, use, or disclosure of your Personal Information. Your
      Personal Information is stored on secure servers and is not publicly available. We limit access of your
      Personal Information only to those employees or partners that need to know the Personal Information in order
      to achieve the purposes of processing, as described above. You need to help us prevent unuthorized access to
      your account by protecting and limiting access to your account appropriately (for example, by logging out
      after you have finished accessing your account). You will be solely responsible for keeping your account
      against any unauthorized use. While we seek to protect your information to ensure that it is kept
      confidential, we cannot absolutely guarantee its security. However, we do not store any passwords as an added
      layer of security. Please be aware that no security measures are perfect or impenetrable and thus we cannot
      and do not guarantee the security of your data. While we strive to protect your Personal Information, we
      cannot ensure or warrant the security and privacy of your Personal Information or other content you transmit
      using the Services, and you do so at your own risk. It is important that you maintain the security and
      control of your account credentials.
      <br />
      <br />
      <h3>HOW LONG DO WE KEEP YOUR INFORMATION?</h3>
      We will retain your Information for as long as necessary to provide our Services, and as necessary to comply
      with our legal obligations (including those specific to financial transactions), resolve disputes, and
      enforce our policies. Retention periods will be determined taking into account the type of information that
      is collected and the purpose for which it is collected, bearing in mind the requirements applicable to the
      situation and the need to destroy outdated, unused information at the earliest reasonable time.
      <br />
      <br />
      <h3>YOUR RIGHTS</h3>
      You may, of course, decline to share certain information with us, in which case we may not be able to provide
      to you some of the features and functionality of the Services. From time to time, we send marketing e-mail
      messages to our users, including promotional material concerning our Services. If you no longer want to
      receive such emails from us on a going forward basis, you may opt-out via the "unsubscribe" link provided in
      each such email.
      <br />
      <br />
      <h3>NO USE OF SERVICES BY MINORS</h3>
      The Services is not directed to individuals under the age of eighteen (18), and we request that you do not
      provide personal information through the Services if you are under 18.
      <br />
      <br />
      <h3>CROSS-BORDER DATA TRANSFER</h3>
      Please note that we may be transferring your information outside of your region for storage and processing
      and around the globe. By using the Services you consent to the transfer of information to countries outside
      of your country of residence, which may have data protection rules that are different from those of your
      country.
      <br />
      <br />
      <h3>UPDATES TO THIS PRIVACY POLICY</h3>
      We may make changes to this Policy. The "Last Updated" date at the bottom of this page indicates when this
      Policy was last revised. If we make material changes, we may notify you through the Services or by sending
      you an email or other communication. The most current version will always be posted on our website. We
      encourage you to read this Policy periodically to stay up-to-date about our privacy practices. By continuing
      to access or use our Services after any revisions become effective, you agree to be bound by the updated
      Policy.
      <br />
      <br />
      <h3>CONTACT US</h3>
      If you have any questions about this Policy, please contact us at{' '}
      <a href="mailto:contact@goosefx.io">contact@goosefx.io</a>.
    </WRAPPER>
  </Modal>
)
