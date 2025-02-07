
import { ILayout } from '../interfaces'
import { HeaderVersion01 } from './version-01'

export function Header(props: ILayout) {
  const type = 'version01'

  switch (type) {
    default:
      return <HeaderVersion01 {...props} />
  }
}
