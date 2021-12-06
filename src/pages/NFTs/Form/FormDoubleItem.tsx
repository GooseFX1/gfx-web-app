import React, { ReactNode } from 'react'
import { Form, Input, DatePicker, Col } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { StyledFormDoubleItem } from './FormDoubleItem.styled'

interface DataFormItem {
  name: string
  label?: string
  defaultValue?: any
  placeholder?: string
  hint?: string | ReactNode
  type: string
}
type Props = {
  className?: string
  data: DataFormItem[]
}

export const FormDoubleItem = ({ className, data }: Props) => {
  return (
    <StyledFormDoubleItem className={className}>
      {data.map((item) => (
        <Col span={12}>
          <Form.Item label={item.label} name={item.name}>
            {item.type === 'input' ? (
              <Input placeholder={item?.placeholder} defaultValue={item?.defaultValue} />
            ) : (
              <DatePicker format="DD/MM/YYYY" defaultValue={item?.defaultValue} suffixIcon={<DownOutlined />} />
            )}
            {item?.hint > 0 && <div className="hint">{item?.hint}</div>}
          </Form.Item>
        </Col>
      ))}
    </StyledFormDoubleItem>
  )
}
