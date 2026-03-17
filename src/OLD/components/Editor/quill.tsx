import { useEffect, useRef } from 'react'

import Quill from 'quill'

function decodeHtmlEntities(html: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = html
  return textarea.value
}

function isHtmlEscaped(html: string): boolean {
  if(!html){
    return true
  }
  return html.includes('&lt;') || html.includes('&gt;') || html.includes('&quot;') || html.includes('&amp;')
}

export function EditorQuill(props: { value?: string; handleOnChange: (value: string) => void }) {
  const ID = 'id-' + Math.random().toString(36).substring(2, 9)

  const quillRef = useRef<Quill>(null)

  useEffect(() => {
    if (!quillRef.current) {
      const reference = new Quill('#' + ID, {
        theme: 'snow',
      }) as any

      (quillRef as any).current = reference

      if (props.value) {
        // Decodificar se o HTML estiver escapado
        const decodedValue = isHtmlEscaped(props.value) ? decodeHtmlEntities(props.value) : props.value
        reference.root.innerHTML = decodedValue
      }

      reference.on(Quill.events.TEXT_CHANGE, () => {
        const html = reference.root.innerHTML
        
        console.log(html)
        if(html !== props.value) {
          props.handleOnChange(html)
        }else {
          
        }
      })
    }
  }, [])

  useEffect(() => {
    if (quillRef.current && props.value !== undefined && quillRef.current.root.innerHTML !== props.value) {

      const editor = quillRef.current
      if (editor.root.innerHTML !== props.value) {
        // Decodificar se o HTML estiver escapado
        const decodedValue = isHtmlEscaped(props.value) ? decodeHtmlEntities(props.value) : props.value
        editor.root.innerHTML = decodedValue
      }
    }
  }, [props.value])

  return (
      <div id={ID} />
  )
}
