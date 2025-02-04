import { Dispatch, SetStateAction } from 'react'

import { IMessage } from './card/interfaces'

export interface IMessageContentProps {
  messages: IMessage[]
  setVisible: Dispatch<SetStateAction<boolean>>
}
