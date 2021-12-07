import React, { ReactNode } from 'react'
import { Form, Input, DatePicker, Col } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { StyledFormDoubleItem } from './FormDoubleItem.styled'
import { Dropdown } from '../Form/Dropdown'
import isEmpty from 'lodash/isEmpty'

interface DataFormItem {
  name: string
  label?: string
  defaultValue?: any
  placeholder?: string
  hint?: string | ReactNode
  unit?: string
  type: string
}
type Props = {
  className?: string
  data?: DataFormItem[]
  startingDays?: any
  expirationDays?: any
  onChange?: (val: any) => void
}

export const FormDoubleItem = ({ className, data, startingDays, expirationDays, onChange }: Props) => {
  return (
    <StyledFormDoubleItem className={className}>
      {!isEmpty(data) ? (
        data.map((item) => (
          <Col span={12}>
            <Form.Item label={item.label} name={item.name}>
              {item.type === 'input' ? (
                <>
                  <Input
                    placeholder={item?.placeholder}
                    defaultValue={item?.defaultValue}
                    onChange={(e) => onChange({ e, id: item?.name })}
                  />
                  {item?.unit && <div className="unit">{item?.unit}</div>}
                </>
              ) : (
                <DatePicker format="DD/MM/YYYY" defaultValue={item?.defaultValue} suffixIcon={<DownOutlined />} />
              )}
              {item?.hint && <div className="hint">{item?.hint}</div>}
            </Form.Item>
          </Col>
        ))
      ) : (
        <>
          <Col span={12} className="dropdown-item">
            <Form.Item label="Starting day" name="startingDay">
              <Dropdown days={startingDays} />
            </Form.Item>
          </Col>
          <Col span={12} className="dropdown-item">
            <Form.Item label="Expiration day" name="expirationDay">
              <Dropdown days={expirationDays} />
            </Form.Item>
          </Col>
        </>
      )}
    </StyledFormDoubleItem>
  )
}
