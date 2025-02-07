import { Error } from 'infinity-forge'

import { MessageCard } from './card'

import { IMessage } from './card/interfaces'

import * as S from './styles'

export function Content() {
  const messages: IMessage[] = [
    {
      title: 'Edital 88/2023',
      url: '#',
      status: {
        text: 'Em análise',
        color: '#F4A100',
      },
      date: 'há 6 dias',
      name: 'Camila',
      description:
        'Lorem ipsum dolor sit amet, consectetur adip elit, sed do eiusmod tempor incididunt ut labore este...',
    },
    {
      title: 'Edital 88/2023',
      url: '#',
      status: {
        text: 'Em análise',
        color: '#F4A100',
      },
      date: 'há 6 dias',
      name: 'Camila',
      description:
        'Lorem ipsum dolor sit amet, consectetur adip elit, sed do eiusmod tempor incididunt ut labore este...',
    },
    {
      title: 'Edital 88/2023',
      url: '#',
      status: {
        text: 'Em análise',
        color: '#F4A100',
      },
      date: 'há 6 dias',
      name: 'Camila',
      description:
        'Lorem ipsum dolor sit amet, consectetur adip elit, sed do eiusmod tempor incididunt ut labore este...',
    },
    {
      title: 'Edital 88/2023',
      url: '#',
      status: {
        text: 'Em análise',
        color: '#F4A100',
      },
      date: 'há 6 dias',
      name: 'Camila',
      description:
        'Lorem ipsum dolor sit amet, consectetur adip elit, sed do eiusmod tempor incididunt ut labore este...',
    },
  ]

  return (
    <Error name='Content'>
      <S.Content>
        <div className='cards-box'>
          {messages.map((item) => (
            <MessageCard key={'message-card' + item.title} {...item} />
          ))}
        </div>
      </S.Content>
    </Error>
  )
}
