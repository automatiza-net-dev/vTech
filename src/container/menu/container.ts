import { Container } from 'inversify'

import { RemoteMenu } from '@/data'

import { menuTypes } from './types'
import { infraContainer } from '../infra'

const menuContainer = new Container({ defaultScope: 'Singleton', autoBindInjectable: true })

menuContainer.parent = infraContainer
menuContainer.bind(menuTypes.RemoteMenuAutomatiza).to(RemoteMenu)

export { menuContainer }
