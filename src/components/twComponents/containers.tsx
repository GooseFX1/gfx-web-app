import tw from 'twin.macro'
import { FC } from 'react'
const TWFlex = tw.div`flex`
export interface FlexProps {
  children?: React.ReactNode
  row?: boolean
  column?: boolean
  gap?: string
  rest?: string
}
export const Flex: FC<FlexProps> = ({ children, row, column }) => (
  <TWFlex css={[row && tw`flex-row`, column && tw`flex-col`]}>{children}</TWFlex>
)
