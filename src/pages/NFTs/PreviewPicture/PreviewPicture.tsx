import React from 'react'
import styled from 'styled-components'

export const STYLED_PREVIEW_PICTURE = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['5x']};
  background: #131313;
  ${({ theme }) => theme.largeBorderRadius};

  .preview {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: ${({ theme }) => theme.margins['1x']};
  }

  .main-image {
    ${({ theme }) => theme.largeBorderRadius};
  }

  .title {
    font-size: 14px;
    margin-top: 12px;
    margin-bottom: 0;
    font-weight: 600;
    line-height: 1;
  }

  .desc {
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    margin-top: ${({ theme }) => theme.margins['1x']};
  }
`

interface DataPicture {
  text?: string
  image: string
  title?: string
  desc?: string
}

type Props = {
  data: DataPicture
}

export const PreviewPicture = ({ data }: Props) => {
  return (
    <STYLED_PREVIEW_PICTURE>
      <div className="preview">{data?.text}</div>
      <img className="main-image" src={data?.image} alt="" />
      <h3 className="title">{data?.title}</h3>
      <div className="desc">{data?.desc}</div>
    </STYLED_PREVIEW_PICTURE>
  )
}
