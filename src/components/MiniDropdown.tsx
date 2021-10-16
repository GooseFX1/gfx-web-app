import { Select } from 'antd'
import { FC, ReactElement } from 'react'
import styled from 'styled-components'
import { SVGToWhite } from '../styles'

export const MiniDropdown: FC<{
  backgroundColor: string
  color: string
  fontsize: string
  height: string
  width: string
  defaultValue: any
  dropdownHeight: string
  dropdownWidth: string
  dropdownRadius: number
  dropdownBackground: string
  iconHeight: number
  iconWidth: number
  iconRightMargin: number
  options: ReactElement
}> = ({
  backgroundColor,
  color,
  fontsize,
  height,
  width,
  defaultValue,
  dropdownHeight,
  dropdownWidth,
  dropdownRadius,
  dropdownBackground,
  iconHeight,
  iconWidth,
  iconRightMargin,
  options
}) => {
  return (
    <Select
      bordered={false}
      style={{
        backgroundColor: backgroundColor,
        color: color,
        fontSize: fontsize,
        height: height,
        width: width,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0
      }}
      defaultValue={defaultValue}
      dropdownStyle={{
        height: dropdownHeight,
        width: dropdownWidth,
        borderRadius: dropdownRadius,
        backgroundColor: dropdownBackground
      }}
      suffixIcon={
        <SVGToWhite
          src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`}
          alt="arrow"
          style={{ height: iconHeight, width: iconWidth, marginRight: iconRightMargin }}
        />
      }
    >
      {options}
    </Select>
  )
}
